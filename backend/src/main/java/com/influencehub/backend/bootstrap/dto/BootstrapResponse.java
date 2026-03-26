package com.influencehub.backend.bootstrap.dto;

import java.util.List;

public class BootstrapResponse {

    private final String productName;
    private final List<String> roomFeatures;
    private final List<String> connectedPlatforms;
    private final List<String> onboardingSteps;

    public BootstrapResponse(
        String productName,
        List<String> roomFeatures,
        List<String> connectedPlatforms,
        List<String> onboardingSteps
    ) {
        this.productName = productName;
        this.roomFeatures = roomFeatures;
        this.connectedPlatforms = connectedPlatforms;
        this.onboardingSteps = onboardingSteps;
    }

    public String getProductName() {
        return productName;
    }

    public List<String> getRoomFeatures() {
        return roomFeatures;
    }

    public List<String> getConnectedPlatforms() {
        return connectedPlatforms;
    }

    public List<String> getOnboardingSteps() {
        return onboardingSteps;
    }
}
