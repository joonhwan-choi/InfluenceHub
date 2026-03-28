package com.influencehub.backend.store.dto;

public class StoreImportPreviewResponse {

    private final String sourceUrl;
    private final String productName;
    private final String description;
    private final String imageUrl;
    private final String priceText;
    private final String sourceLabel;
    private final String note;

    public StoreImportPreviewResponse(
        String sourceUrl,
        String productName,
        String description,
        String imageUrl,
        String priceText,
        String sourceLabel,
        String note
    ) {
        this.sourceUrl = sourceUrl;
        this.productName = productName;
        this.description = description;
        this.imageUrl = imageUrl;
        this.priceText = priceText;
        this.sourceLabel = sourceLabel;
        this.note = note;
    }

    public String getSourceUrl() {
        return sourceUrl;
    }

    public String getProductName() {
        return productName;
    }

    public String getDescription() {
        return description;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public String getPriceText() {
        return priceText;
    }

    public String getSourceLabel() {
        return sourceLabel;
    }

    public String getNote() {
        return note;
    }
}
