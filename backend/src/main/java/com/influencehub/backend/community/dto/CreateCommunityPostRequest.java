package com.influencehub.backend.community.dto;

import com.fasterxml.jackson.annotation.JsonAlias;

public class CreateCommunityPostRequest {

    private String title;
    private String content;

    @JsonAlias({"imageUrl", "image_url"})
    private String imageUrl;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
