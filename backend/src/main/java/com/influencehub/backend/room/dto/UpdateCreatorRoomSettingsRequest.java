package com.influencehub.backend.room.dto;

import java.util.List;

public class UpdateCreatorRoomSettingsRequest {

    private String roomThemeId;
    private String bannerStyle;
    private String buttonStyle;
    private String cardDensity;
    private String discordWebhookUrl;
    private Boolean discordEnabled;
    private String instagramAccountId;
    private String instagramAccessToken;
    private Boolean instagramEnabled;
    private List<String> selectedFeatures;

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

    public String getDiscordWebhookUrl() {
        return discordWebhookUrl;
    }

    public Boolean getDiscordEnabled() {
        return discordEnabled;
    }

    public String getInstagramAccountId() {
        return instagramAccountId;
    }

    public String getInstagramAccessToken() {
        return instagramAccessToken;
    }

    public Boolean getInstagramEnabled() {
        return instagramEnabled;
    }

    public List<String> getSelectedFeatures() {
        return selectedFeatures;
    }
}
