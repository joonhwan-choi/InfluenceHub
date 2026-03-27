package com.influencehub.backend.publish.dto;

import java.time.LocalDateTime;

public class PublishJobHistoryResponse {

    private final Long publishJobId;
    private final String platform;
    private final String status;
    private final String title;
    private final String targetUrl;
    private final LocalDateTime scheduledAt;
    private final LocalDateTime createdAt;

    public PublishJobHistoryResponse(
        Long publishJobId,
        String platform,
        String status,
        String title,
        String targetUrl,
        LocalDateTime scheduledAt,
        LocalDateTime createdAt
    ) {
        this.publishJobId = publishJobId;
        this.platform = platform;
        this.status = status;
        this.title = title;
        this.targetUrl = targetUrl;
        this.scheduledAt = scheduledAt;
        this.createdAt = createdAt;
    }

    public Long getPublishJobId() {
        return publishJobId;
    }

    public String getPlatform() {
        return platform;
    }

    public String getStatus() {
        return status;
    }

    public String getTitle() {
        return title;
    }

    public String getTargetUrl() {
        return targetUrl;
    }

    public LocalDateTime getScheduledAt() {
        return scheduledAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
