package com.influencehub.backend.auth.repository;

import com.influencehub.backend.auth.domain.CreatorSession;
import java.time.LocalDateTime;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CreatorSessionRepository extends JpaRepository<CreatorSession, Long> {

    Optional<CreatorSession> findBySessionToken(String sessionToken);

    void deleteBySessionToken(String sessionToken);

    void deleteByExpiresAtBefore(LocalDateTime expiresAt);
}
