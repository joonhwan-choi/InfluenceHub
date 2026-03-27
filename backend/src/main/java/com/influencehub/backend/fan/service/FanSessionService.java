package com.influencehub.backend.fan.service;

import com.influencehub.backend.fan.domain.FanMembership;
import com.influencehub.backend.fan.domain.FanSession;
import com.influencehub.backend.fan.dto.FanAuthResponse;
import com.influencehub.backend.fan.dto.FanLoginRequest;
import com.influencehub.backend.fan.dto.FanRoomSummaryResponse;
import com.influencehub.backend.fan.repository.FanMembershipRepository;
import com.influencehub.backend.fan.repository.FanSessionRepository;
import com.influencehub.backend.user.domain.User;
import com.influencehub.backend.user.domain.UserRole;
import com.influencehub.backend.user.repository.UserRepository;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FanSessionService {

    private static final int SESSION_TOKEN_BYTES = 32;
    private static final long SESSION_DAYS = 14L;

    private final FanSessionRepository fanSessionRepository;
    private final FanMembershipRepository fanMembershipRepository;
    private final UserRepository userRepository;
    private final SecureRandom secureRandom = new SecureRandom();

    public FanSessionService(
        FanSessionRepository fanSessionRepository,
        FanMembershipRepository fanMembershipRepository,
        UserRepository userRepository
    ) {
        this.fanSessionRepository = fanSessionRepository;
        this.fanMembershipRepository = fanMembershipRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public FanAuthResponse issueSession(User fan) {
        fanSessionRepository.deleteByExpiresAtBefore(LocalDateTime.now());

        FanSession session = fanSessionRepository.save(
            new FanSession(fan, nextToken(), LocalDateTime.now().plusDays(SESSION_DAYS))
        );

        return toResponse(session);
    }

    @Transactional
    public FanAuthResponse login(FanLoginRequest request) {
        String email = request.getEmail().trim().toLowerCase(Locale.ROOT);
        User fan = userRepository.findByEmail(email)
            .orElseThrow(() -> new IllegalStateException("가입된 팬 계정이 없습니다. 먼저 초대 링크로 가입하세요."));

        if (fan.getRole() != UserRole.FAN) {
            throw new IllegalStateException("팬 계정으로만 로그인할 수 있습니다.");
        }

        if (request.getNickname() != null && !request.getNickname().trim().isEmpty()) {
            fan.updateProfile(request.getNickname().trim(), fan.getProfileImageUrl());
        }

        if (fanMembershipRepository.findByFanOrderByCreatedAtDesc(fan).isEmpty()) {
            throw new IllegalStateException("가입한 팬방이 없어 로그인할 수 없습니다.");
        }

        return issueSession(fan);
    }

    @Transactional(readOnly = true)
    public FanAuthResponse currentSession(String sessionToken) {
        FanSession session = fanSessionRepository.findBySessionToken(sessionToken)
            .orElseThrow(() -> new IllegalStateException("팬 세션이 없습니다."));

        if (session.isExpired(LocalDateTime.now())) {
            throw new IllegalStateException("팬 세션이 만료되었습니다.");
        }

        return toResponse(session);
    }

    @Transactional
    public void logout(String sessionToken) {
        fanSessionRepository.deleteBySessionToken(sessionToken);
    }

    private FanAuthResponse toResponse(FanSession session) {
        List<FanRoomSummaryResponse> joinedRooms = fanMembershipRepository.findByFanOrderByCreatedAtDesc(session.getFan())
            .stream()
            .map(this::toRoomSummary)
            .collect(Collectors.toList());

        return new FanAuthResponse(
            session.getSessionToken(),
            session.getExpiresAt(),
            session.getFan().getEmail(),
            session.getFan().getNickname(),
            joinedRooms
        );
    }

    private FanRoomSummaryResponse toRoomSummary(FanMembership membership) {
        return new FanRoomSummaryResponse(
            membership.getId(),
            membership.getRoom().getOwner().getNickname(),
            membership.getRoom().getRoomName(),
            membership.getRoom().getSlug(),
            membership.getJoinedVia(),
            membership.getTier().name()
        );
    }

    private String nextToken() {
        byte[] bytes = new byte[SESSION_TOKEN_BYTES];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}
