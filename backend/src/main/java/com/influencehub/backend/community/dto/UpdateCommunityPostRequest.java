package com.influencehub.backend.community.dto;

public class UpdateCommunityPostRequest extends CreateCommunityPostRequest {

    private Boolean highlighted;

    public Boolean getHighlighted() {
        return highlighted;
    }

    public void setHighlighted(Boolean highlighted) {
        this.highlighted = highlighted;
    }
}
