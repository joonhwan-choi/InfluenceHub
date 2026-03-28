package com.influencehub.backend.store.dto;

public class StoreImageUploadResponse {

    private final String imageUrl;
    private final String fileName;

    public StoreImageUploadResponse(String imageUrl, String fileName) {
        this.imageUrl = imageUrl;
        this.fileName = fileName;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public String getFileName() {
        return fileName;
    }
}
