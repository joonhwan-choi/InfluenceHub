package com.influencehub.backend.fan.repository;

import com.influencehub.backend.fan.domain.FanSession;
import java.time.LocalDateTime;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FanSessionRepository extends JpaRepository<FanSession, Long> {

    Optional<FanSession> findBySessionToken(String sessionToken);

    void deleteBySessionToken(String sessionToken);

    void deleteByExpiresAtBefore(LocalDateTime expiresAt);
}
