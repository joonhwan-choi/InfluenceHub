package com.influencehub.backend.fan.service;

import com.influencehub.backend.auth.domain.CreatorSession;
import com.influencehub.backend.auth.service.CreatorAuthService;
import com.influencehub.backend.fan.domain.FanMembership;
import com.influencehub.backend.fan.domain.InviteJoinEvent;
import com.influencehub.backend.fan.domain.InviteLink;
import com.influencehub.backend.fan.dto.CreateInviteLinkRequest;
import com.influencehub.backend.fan.dto.CreatorInviteDashboardResponse;
import com.influencehub.backend.fan.dto.FanAuthResponse;
import com.influencehub.backend.fan.dto.FanJoinInviteRequest;
import com.influencehub.backend.fan.dto.InviteLinkDetailResponse;
import com.influencehub.backend.fan.dto.InviteLinkResponse;
import com.influencehub.backend.fan.repository.FanMembershipRepository;
import com.influencehub.backend.fan.repository.InviteJoinEventRepository;
import com.influencehub.backend.fan.repository.InviteLinkRepository;
import com.influencehub.backend.user.domain.AuthProvider;
import com.influencehub.backend.user.domain.User;
import com.influencehub.backend.user.domain.UserRole;
import com.influencehub.backend.user.repository.UserRepository;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FanInviteService {

    private static final int INVITE_CODE_BYTES = 9;

    private final InviteLinkRepository inviteLinkRepository;
    private final FanMembershipRepository fanMembershipRepository;
    private final InviteJoinEventRepository inviteJoinEventRepository;
    private final UserRepository userRepository;
    private final CreatorAuthService creatorAuthService;
    private final FanSessionService fanSessionService;
    private final SecureRandom secureRandom = new SecureRandom();
    private final String frontendUrl;

    public FanInviteService(
        InviteLinkRepository inviteLinkRepository,
        FanMembershipRepository fanMembershipRepository,
        InviteJoinEventRepository inviteJoinEventRepository,
        UserRepository userRepository,
        CreatorAuthService creatorAuthService,
        FanSessionService fanSessionService,
        @Value("${app.frontend-url:https://influence-hub-six.vercel.app}") String frontendUrl
    ) {
        this.inviteLinkRepository = inviteLinkRepository;
        this.fanMembershipRepository = fanMembershipRepository;
        this.inviteJoinEventRepository = inviteJoinEventRepository;
        this.userRepository = userRepository;
        this.creatorAuthService = creatorAuthService;
        this.fanSessionService = fanSessionService;
        this.frontendUrl = frontendUrl;
    }

    @Transactional
    public InviteLinkResponse createInviteLink(String creatorSessionToken, CreateInviteLinkRequest request) {
        CreatorSession creatorSession = creatorAuthService.requireSession(creatorSessionToken);
        InviteLink inviteLink = inviteLinkRepository.save(
            new InviteLink(
                creatorSession.getRoom(),
                creatorSession.getUser(),
                nextInviteCode(),
                request.getTitle().trim(),
                request.getSourceLabel().trim()
            )
        );

        return toInviteResponse(inviteLink);
    }

    @Transactional(readOnly = true)
    public CreatorInviteDashboardResponse creatorDashboard(String creatorSessionToken) {
        CreatorSession creatorSession = creatorAuthService.requireSession(creatorSessionToken);
        List<InviteLink> inviteLinks = inviteLinkRepository.findByRoomOrderByCreatedAtDesc(creatorSession.getRoom());
        List<FanMembership> roomMemberships = fanMembershipRepository.findByRoomOrderByCreatedAtDesc(creatorSession.getRoom());

        long totalOpenCount = inviteLinks.stream().mapToLong(InviteLink::getOpenCount).sum();
        long totalJoinCount = inviteLinks.stream().mapToLong(InviteLink::getJoinCount).sum();
        long multiRoomFanCount = roomMemberships.stream()
            .map(FanMembership::getFan)
            .filter(fan -> fanMembershipRepository.findByFanOrderByCreatedAtDesc(fan).size() > 1)
            .map(User::getId)
            .collect(Collectors.toSet())
            .size();

        return new CreatorInviteDashboardResponse(
            totalOpenCount,
            totalJoinCount,
            multiRoomFanCount,
            inviteLinks.stream().map(this::toInviteResponse).collect(Collectors.toList())
        );
    }

    @Transactional
    public InviteLinkDetailResponse openInvite(String inviteCode) {
        InviteLink inviteLink = inviteLinkRepository.findByInviteCode(inviteCode)
            .orElseThrow(() -> new IllegalStateException("초대 링크를 찾을 수 없습니다."));
        inviteLink.recordOpen();
        inviteLinkRepository.save(inviteLink);

        return new InviteLinkDetailResponse(
            inviteLink.getInviteCode(),
            inviteLink.getTitle(),
            inviteLink.getSourceLabel(),
            inviteLink.getRoom().getRoomName(),
            inviteLink.getRoom().getSlug(),
            inviteLink.getCreator().getNickname(),
            inviteLink.getRoom().getDescription()
        );
    }

    @Transactional
    public FanAuthResponse joinInvite(FanJoinInviteRequest request) {
        InviteLink inviteLink = inviteLinkRepository.findByInviteCode(request.getInviteCode())
            .orElseThrow(() -> new IllegalStateException("초대 링크를 찾을 수 없습니다."));

        User fan = userRepository.findByEmail(request.getEmail().trim().toLowerCase(Locale.ROOT))
            .map(existing -> {
                existing.updateProfile(request.getNickname().trim(), existing.getProfileImageUrl());
                return existing;
            })
            .orElseGet(() -> userRepository.save(
                new User(
                    request.getEmail().trim().toLowerCase(Locale.ROOT),
                    request.getNickname().trim(),
                    UserRole.FAN,
                    AuthProvider.GOOGLE
                )
            ));

        boolean newlyJoined = false;
        if (fanMembershipRepository.findByFanAndRoom(fan, inviteLink.getRoom()).isEmpty()) {
            fanMembershipRepository.save(
                new FanMembership(fan, inviteLink.getRoom(), inviteLink, inviteLink.getSourceLabel())
            );
            inviteLink.recordJoin();
            inviteLinkRepository.save(inviteLink);
            newlyJoined = true;
        }

        inviteJoinEventRepository.save(new InviteJoinEvent(inviteLink, fan, newlyJoined));
        return fanSessionService.issueSession(fan);
    }

    private InviteLinkResponse toInviteResponse(InviteLink inviteLink) {
        return new InviteLinkResponse(
            inviteLink.getId(),
            inviteLink.getInviteCode(),
            inviteLink.getTitle(),
            inviteLink.getSourceLabel(),
            inviteLink.getOpenCount(),
            inviteLink.getJoinCount(),
            frontendUrl + "/invite/" + inviteLink.getInviteCode()
        );
    }

    private String nextInviteCode() {
        byte[] bytes = new byte[INVITE_CODE_BYTES];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}
