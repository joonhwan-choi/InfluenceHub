package com.influencehub.backend.fan.service;

import com.influencehub.backend.auth.domain.CreatorSession;
import com.influencehub.backend.auth.service.CreatorAuthService;
import com.influencehub.backend.fan.domain.FanMembership;
import com.influencehub.backend.fan.domain.FanTier;
import com.influencehub.backend.fan.domain.InviteJoinEvent;
import com.influencehub.backend.fan.domain.InviteLink;
import com.influencehub.backend.fan.dto.CreateInviteLinkRequest;
import com.influencehub.backend.fan.dto.CreatorFanMemberResponse;
import com.influencehub.backend.fan.dto.CreatorInviteDashboardResponse;
import com.influencehub.backend.fan.dto.FanAuthResponse;
import com.influencehub.backend.fan.dto.GoogleUserProfile;
import com.influencehub.backend.fan.dto.FanJoinInviteRequest;
import com.influencehub.backend.fan.dto.InviteLinkDetailResponse;
import com.influencehub.backend.fan.dto.InviteLinkResponse;
import com.influencehub.backend.fan.dto.UpdateFanTierRequest;
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

    @Transactional(readOnly = true)
    public List<CreatorFanMemberResponse> creatorFanMembers(String creatorSessionToken) {
        CreatorSession creatorSession = creatorAuthService.requireSession(creatorSessionToken);
        return fanMembershipRepository.findByRoomOrderByCreatedAtDesc(creatorSession.getRoom())
            .stream()
            .map(membership -> new CreatorFanMemberResponse(
                membership.getId(),
                membership.getFan().getEmail(),
                membership.getFan().getNickname(),
                membership.getJoinedVia(),
                membership.getTier().name()
            ))
            .collect(Collectors.toList());
    }

    @Transactional
    public CreatorFanMemberResponse updateFanTier(
        String creatorSessionToken,
        Long membershipId,
        UpdateFanTierRequest request
    ) {
        CreatorSession creatorSession = creatorAuthService.requireSession(creatorSessionToken);
        FanMembership membership = fanMembershipRepository.findById(membershipId)
            .orElseThrow(() -> new IllegalStateException("팬 멤버십을 찾을 수 없습니다."));

        if (!membership.getRoom().getId().equals(creatorSession.getRoom().getId())) {
            throw new IllegalStateException("내 팬방의 팬만 분류할 수 있습니다.");
        }

        FanTier nextTier = FanTier.valueOf(request.getTier().trim().toUpperCase(Locale.ROOT));
        membership.updateTier(nextTier);

        return new CreatorFanMemberResponse(
            membership.getId(),
            membership.getFan().getEmail(),
            membership.getFan().getNickname(),
            membership.getJoinedVia(),
            membership.getTier().name()
        );
    }

    @Transactional
    public InviteLinkResponse deactivateInviteLink(String creatorSessionToken, Long inviteLinkId) {
        CreatorSession creatorSession = creatorAuthService.requireSession(creatorSessionToken);
        InviteLink inviteLink = inviteLinkRepository.findById(inviteLinkId)
            .orElseThrow(() -> new IllegalStateException("초대 링크를 찾을 수 없습니다."));

        if (!inviteLink.getRoom().getId().equals(creatorSession.getRoom().getId())) {
            throw new IllegalStateException("내 팬방의 초대 링크만 관리할 수 있습니다.");
        }

        inviteLink.deactivate();
        inviteLinkRepository.save(inviteLink);
        return toInviteResponse(inviteLink);
    }

    @Transactional
    public InviteLinkDetailResponse openInvite(String inviteCode) {
        InviteLink inviteLink = inviteLinkRepository.findByInviteCode(inviteCode)
            .orElseThrow(() -> new IllegalStateException("초대 링크를 찾을 수 없습니다."));
        if (!inviteLink.isActive()) {
            throw new IllegalStateException("비활성화된 초대 링크입니다.");
        }
        inviteLink.recordOpen();
        inviteLinkRepository.save(inviteLink);

        return new InviteLinkDetailResponse(
            inviteLink.getInviteCode(),
            inviteLink.getTitle(),
            inviteLink.getSourceLabel(),
            inviteLink.getRoom().getRoomName(),
            inviteLink.getRoom().getSlug(),
            inviteLink.getCreator().getNickname(),
            inviteLink.getRoom().getDescription(),
            inviteLink.isActive()
        );
    }

    @Transactional
    public FanAuthResponse joinInvite(FanJoinInviteRequest request) {
        return joinInviteInternal(
            request.getInviteCode(),
            request.getEmail().trim().toLowerCase(Locale.ROOT),
            request.getNickname().trim(),
            ""
        );
    }

    @Transactional
    public FanAuthResponse joinInviteWithGoogle(String inviteCode, GoogleUserProfile profile) {
        return joinInviteInternal(
            inviteCode,
            profile.getEmail().trim().toLowerCase(Locale.ROOT),
            profile.getName().trim(),
            profile.getPicture()
        );
    }

    private FanAuthResponse joinInviteInternal(
        String inviteCode,
        String email,
        String nickname,
        String profileImageUrl
    ) {
        InviteLink inviteLink = inviteLinkRepository.findByInviteCode(inviteCode)
            .orElseThrow(() -> new IllegalStateException("초대 링크를 찾을 수 없습니다."));
        if (!inviteLink.isActive()) {
            throw new IllegalStateException("비활성화된 초대 링크입니다.");
        }

        User fan = userRepository.findByEmail(email)
            .map(existing -> {
                existing.updateProfile(
                    nickname,
                    profileImageUrl == null || profileImageUrl.isBlank()
                        ? existing.getProfileImageUrl()
                        : profileImageUrl
                );
                return existing;
            })
            .orElseGet(() -> userRepository.save(
                new User(
                    email,
                    nickname,
                    UserRole.FAN,
                    AuthProvider.GOOGLE
                )
            ));

        if (profileImageUrl != null && !profileImageUrl.isBlank()) {
            fan.updateProfile(nickname, profileImageUrl);
        }

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
            inviteLink.isActive(),
            frontendUrl + "/invite/" + inviteLink.getInviteCode()
        );
    }

    private String nextInviteCode() {
        byte[] bytes = new byte[INVITE_CODE_BYTES];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}
