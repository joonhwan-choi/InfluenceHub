package com.influencehub.backend.instagram.dto;

import com.fasterxml.jackson.annotation.JsonAlias;

public class InstagramPublishRequest {

    private String title;
    private String caption;

    @JsonAlias({"media_url", "image_url"})
    private String mediaUrl;

    public String getTitle() {
        return title;
    }

    public String getCaption() {
        return caption;
    }

    public String getMediaUrl() {
        return mediaUrl;
    }
}
