package com.influencehub.backend.room.dto;

import java.util.List;

public class CreatorRoomSettingsResponse {

    private final String roomThemeId;
    private final String bannerStyle;
    private final String buttonStyle;
    private final String cardDensity;
    private final String discordWebhookUrl;
    private final boolean discordEnabled;
    private final List<String> selectedFeatures;

    public CreatorRoomSettingsResponse(
        String roomThemeId,
        String bannerStyle,
        String buttonStyle,
        String cardDensity,
        String discordWebhookUrl,
        boolean discordEnabled,
        List<String> selectedFeatures
    ) {
        this.roomThemeId = roomThemeId;
        this.bannerStyle = bannerStyle;
        this.buttonStyle = buttonStyle;
        this.cardDensity = cardDensity;
        this.discordWebhookUrl = discordWebhookUrl;
        this.discordEnabled = discordEnabled;
        this.selectedFeatures = selectedFeatures;
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

    public String getDiscordWebhookUrl() {
        return discordWebhookUrl;
    }

    public boolean isDiscordEnabled() {
        return discordEnabled;
    }

    public List<String> getSelectedFeatures() {
        return selectedFeatures;
    }
}
