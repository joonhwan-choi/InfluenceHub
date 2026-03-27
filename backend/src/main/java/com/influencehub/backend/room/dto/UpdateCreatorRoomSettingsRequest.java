package com.influencehub.backend.room.dto;

import java.util.List;

public class UpdateCreatorRoomSettingsRequest {

    private String roomThemeId;
    private String bannerStyle;
    private String buttonStyle;
    private String cardDensity;
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

    public List<String> getSelectedFeatures() {
        return selectedFeatures;
    }
}
