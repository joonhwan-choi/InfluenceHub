package com.influencehub.backend.fan.domain;

import com.influencehub.backend.common.BaseTimeEntity;
import com.influencehub.backend.user.domain.User;
import java.time.LocalDateTime;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "fan_sessions")
public class FanSession extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "fan_id", nullable = false)
    private User fan;

    @Column(nullable = false, unique = true, length = 120)
    private String sessionToken;

    @Column(nullable = false)
    private LocalDateTime expiresAt;

    protected FanSession() {
    }

    public FanSession(User fan, String sessionToken, LocalDateTime expiresAt) {
        this.fan = fan;
        this.sessionToken = sessionToken;
        this.expiresAt = expiresAt;
    }

    public Long getId() {
        return id;
    }

    public User getFan() {
        return fan;
    }

    public String getSessionToken() {
        return sessionToken;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }

    public boolean isExpired(LocalDateTime now) {
        return expiresAt.isBefore(now);
    }
}
