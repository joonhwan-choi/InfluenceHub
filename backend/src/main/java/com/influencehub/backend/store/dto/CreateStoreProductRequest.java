package com.influencehub.backend.store.dto;

import javax.validation.constraints.NotBlank;

public class CreateStoreProductRequest {

    @NotBlank
    private String name;

    private String description;
    private String imageUrl;
    private String externalUrl;
    private String priceText;
    private String statusLabel;
    private String salesLabel;
    private String sourceLabel;

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public String getExternalUrl() {
        return externalUrl;
    }

    public String getPriceText() {
        return priceText;
    }

    public String getStatusLabel() {
        return statusLabel;
    }

    public String getSalesLabel() {
        return salesLabel;
    }

    public String getSourceLabel() {
        return sourceLabel;
    }
}
