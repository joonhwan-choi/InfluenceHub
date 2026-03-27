package com.influencehub.backend.auth.service;

import com.influencehub.backend.auth.domain.CreatorSession;
import com.influencehub.backend.auth.dto.CreatorAuthResponse;
import com.influencehub.backend.auth.repository.CreatorSessionRepository;
import com.influencehub.backend.youtube.domain.YoutubeChannelConnection;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CreatorAuthService {

    private static final int SESSION_TOKEN_BYTES = 32;
    private static final long SESSION_DAYS = 14L;

    private final CreatorSessionRepository creatorSessionRepository;
    private final SecureRandom secureRandom = new SecureRandom();

    public CreatorAuthService(CreatorSessionRepository creatorSessionRepository) {
        this.creatorSessionRepository = creatorSessionRepository;
    }

    @Transactional
    public CreatorAuthResponse issueSession(YoutubeChannelConnection connection) {
        creatorSessionRepository.deleteByExpiresAtBefore(LocalDateTime.now());

        CreatorSession session = creatorSessionRepository.save(
            new CreatorSession(
                connection.getUser(),
                connection.getRoom(),
                connection,
                nextToken(),
                LocalDateTime.now().plusDays(SESSION_DAYS)
            )
        );

        return toResponse(session);
    }

    @Transactional(readOnly = true)
    public CreatorAuthResponse currentSession(String sessionToken) {
        CreatorSession session = requireSession(sessionToken);
        return toResponse(session);
    }

    @Transactional(readOnly = true)
    public CreatorSession requireSession(String sessionToken) {
        CreatorSession session = creatorSessionRepository.findBySessionToken(sessionToken)
            .orElseThrow(() -> new IllegalStateException("로그인 세션이 없습니다."));

        if (session.isExpired(LocalDateTime.now())) {
            throw new IllegalStateException("로그인 세션이 만료되었습니다.");
        }
        return session;
    }

    @Transactional
    public void logout(String sessionToken) {
        creatorSessionRepository.deleteBySessionToken(sessionToken);
    }

    private CreatorAuthResponse toResponse(CreatorSession session) {
        YoutubeChannelConnection connection = session.getYoutubeConnection();
        return new CreatorAuthResponse(
            session.getSessionToken(),
            session.getExpiresAt(),
            connection.getId(),
            connection.getYoutubeChannelId(),
            connection.getChannelTitle(),
            connection.getChannelDescription(),
            connection.getRoom().getRoomName(),
            connection.getRoom().getSlug(),
            connection.getSubscriberCount()
        );
    }

    private String nextToken() {
        byte[] bytes = new byte[SESSION_TOKEN_BYTES];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}
