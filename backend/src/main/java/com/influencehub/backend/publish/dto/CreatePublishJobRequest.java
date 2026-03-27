package com.influencehub.backend.publish.dto;

public class CreatePublishJobRequest {

    private String title;
    private String scheduledAt;

    public String getTitle() {
        return title;
    }

    public String getScheduledAt() {
        return scheduledAt;
    }
}
