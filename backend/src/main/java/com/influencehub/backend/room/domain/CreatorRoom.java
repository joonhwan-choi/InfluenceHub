package com.influencehub.backend.room.domain;

import com.influencehub.backend.common.BaseTimeEntity;
import com.influencehub.backend.user.domain.User;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "creator_rooms")
public class CreatorRoom extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @Column(nullable = false, length = 80)
    private String roomName;

    @Column(nullable = false, unique = true, length = 80)
    private String slug;

    @Column(nullable = false, length = 400)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private RoomVisibility visibility;

    @Column(nullable = false, length = 40)
    private String roomThemeId;

    @Column(nullable = false, length = 20)
    private String bannerStyle;

    @Column(nullable = false, length = 20)
    private String buttonStyle;

    @Column(nullable = false, length = 20)
    private String cardDensity;

    @Column(nullable = false, length = 40)
    private String roomLayoutType;

    @Column(length = 1000)
    private String discordWebhookUrl;

    @Column(nullable = false)
    private boolean discordEnabled;

    @Column(length = 255)
    private String instagramAccountId;

    @Column(length = 255)
    private String instagramAccessToken;

    @Column(nullable = false)
    private boolean instagramEnabled;

    protected CreatorRoom() {
    }

    public CreatorRoom(User owner, String roomName, String slug, String description, RoomVisibility visibility) {
        this.owner = owner;
        this.roomName = roomName;
        this.slug = slug;
        this.description = description;
        this.visibility = visibility;
        this.roomThemeId = "hub-classic";
        this.bannerStyle = "focus";
        this.buttonStyle = "rounded";
        this.cardDensity = "comfortable";
        this.roomLayoutType = "community-board";
        this.discordWebhookUrl = null;
        this.discordEnabled = false;
        this.instagramAccountId = null;
        this.instagramAccessToken = null;
        this.instagramEnabled = false;
    }

    public Long getId() {
        return id;
    }

    public User getOwner() {
        return owner;
    }

    public String getRoomName() {
        return roomName;
    }

    public String getSlug() {
        return slug;
    }

    public String getDescription() {
        return description;
    }

    public RoomVisibility getVisibility() {
        return visibility;
    }

    public String getRoomThemeId() {
        return roomThemeId;
    }

    public String getBannerStyle() {
        return bannerStyle;
    }

    public String getButtonStyle() {
        return buttonStyle;
    }

    public String getCardDensity() {
        return cardDensity;
    }

    public String getRoomLayoutType() {
        return roomLayoutType;
    }

    public String getDiscordWebhookUrl() {
        return discordWebhookUrl;
    }

    public boolean isDiscordEnabled() {
        return discordEnabled;
    }

    public String getInstagramAccountId() {
        return instagramAccountId;
    }

    public String getInstagramAccessToken() {
        return instagramAccessToken;
    }

    public boolean isInstagramEnabled() {
        return instagramEnabled;
    }

    public void updateProfile(String roomName, String description) {
        this.roomName = roomName;
        this.description = description;
    }

    public void updateAppearance(String roomThemeId, String bannerStyle, String buttonStyle, String cardDensity, String roomLayoutType) {
        this.roomThemeId = roomThemeId;
        this.bannerStyle = bannerStyle;
        this.buttonStyle = buttonStyle;
        this.cardDensity = cardDensity;
        this.roomLayoutType = roomLayoutType;
    }

    public void updateDiscordSettings(String discordWebhookUrl, boolean discordEnabled) {
        this.discordWebhookUrl = discordWebhookUrl;
        this.discordEnabled = discordEnabled;
    }

    public void updateInstagramSettings(String instagramAccountId, String instagramAccessToken, boolean instagramEnabled) {
        this.instagramAccountId = instagramAccountId;
        this.instagramAccessToken = instagramAccessToken;
        this.instagramEnabled = instagramEnabled;
    }
}
