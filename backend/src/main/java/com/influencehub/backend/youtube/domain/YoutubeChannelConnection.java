package com.influencehub.backend.youtube.domain;

import com.influencehub.backend.common.BaseTimeEntity;
import com.influencehub.backend.room.domain.CreatorRoom;
import com.influencehub.backend.user.domain.User;
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
@Table(name = "youtube_channel_connections")
public class YoutubeChannelConnection extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "room_id", nullable = false)
    private CreatorRoom room;

    @Column(nullable = false, unique = true, length = 80)
    private String youtubeChannelId;

    @Column(nullable = false, length = 120)
    private String channelTitle;

    @Column(nullable = false, length = 3000)
    private String channelDescription;

    @Column(length = 120)
    private String customUrl;

    @Column(length = 300)
    private String thumbnailUrl;

    @Column(length = 40)
    private String subscriberCount;

    @Column(nullable = false, length = 2048)
    private String accessToken;

    @Column(length = 2048)
    private String refreshToken;

    protected YoutubeChannelConnection() {
    }

    public YoutubeChannelConnection(
        User user,
        CreatorRoom room,
        String youtubeChannelId,
        String channelTitle,
        String channelDescription,
        String customUrl,
        String thumbnailUrl,
        String subscriberCount,
        String accessToken,
        String refreshToken
    ) {
        this.user = user;
        this.room = room;
        this.youtubeChannelId = youtubeChannelId;
        this.channelTitle = channelTitle;
        this.channelDescription = channelDescription;
        this.customUrl = customUrl;
        this.thumbnailUrl = thumbnailUrl;
        this.subscriberCount = subscriberCount;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
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

    public String getYoutubeChannelId() {
        return youtubeChannelId;
    }

    public String getChannelTitle() {
        return channelTitle;
    }

    public String getChannelDescription() {
        return channelDescription;
    }

    public String getCustomUrl() {
        return customUrl;
    }

    public String getThumbnailUrl() {
        return thumbnailUrl;
    }

    public String getSubscriberCount() {
        return subscriberCount;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public void updateChannelMetadata(
        String channelTitle,
        String channelDescription,
        String customUrl,
        String thumbnailUrl,
        String subscriberCount,
        String accessToken,
        String refreshToken
    ) {
        this.channelTitle = channelTitle;
        this.channelDescription = channelDescription;
        this.customUrl = customUrl;
        this.thumbnailUrl = thumbnailUrl;
        this.subscriberCount = subscriberCount;
        this.accessToken = accessToken;
        if (refreshToken != null && !refreshToken.isBlank()) {
            this.refreshToken = refreshToken;
        }
    }
}
