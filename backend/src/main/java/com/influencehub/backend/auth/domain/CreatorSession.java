package com.influencehub.backend.auth.domain;

import com.influencehub.backend.common.BaseTimeEntity;
import com.influencehub.backend.room.domain.CreatorRoom;
import com.influencehub.backend.user.domain.User;
import com.influencehub.backend.youtube.domain.YoutubeChannelConnection;
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
@Table(name = "creator_sessions")
public class CreatorSession extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "room_id", nullable = false)
    private CreatorRoom room;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "youtube_connection_id", nullable = false)
    private YoutubeChannelConnection youtubeConnection;

    @Column(nullable = false, unique = true, length = 120)
    private String sessionToken;

    @Column(nullable = false)
    private LocalDateTime expiresAt;

    protected CreatorSession() {
    }

    public CreatorSession(
        User user,
        CreatorRoom room,
        YoutubeChannelConnection youtubeConnection,
        String sessionToken,
        LocalDateTime expiresAt
    ) {
        this.user = user;
        this.room = room;
        this.youtubeConnection = youtubeConnection;
        this.sessionToken = sessionToken;
        this.expiresAt = expiresAt;
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public CreatorRoom getRoom() {
        return room;
    }

    public YoutubeChannelConnection getYoutubeConnection() {
        return youtubeConnection;
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
