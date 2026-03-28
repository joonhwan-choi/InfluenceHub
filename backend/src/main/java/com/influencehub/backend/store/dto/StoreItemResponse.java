package com.influencehub.backend.store.dto;

public class StoreItemResponse {

    private final Long productId;
    private final String name;
    private final String description;
    private final String imageUrl;
    private final String externalUrl;
    private final String priceText;
    private final String statusLabel;
    private final String salesLabel;
    private final String sourceLabel;
    private final boolean visible;

    public StoreItemResponse(
        Long productId,
        String name,
        String description,
        String imageUrl,
        String externalUrl,
        String priceText,
        String statusLabel,
        String salesLabel,
        String sourceLabel,
        boolean visible
    ) {
        this.productId = productId;
        this.name = name;
        this.description = description;
        this.imageUrl = imageUrl;
        this.externalUrl = externalUrl;
        this.priceText = priceText;
        this.statusLabel = statusLabel;
        this.salesLabel = salesLabel;
        this.sourceLabel = sourceLabel;
        this.visible = visible;
    }

    public Long getProductId() {
        return productId;
    }

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

    public boolean isVisible() {
        return visible;
    }
}
