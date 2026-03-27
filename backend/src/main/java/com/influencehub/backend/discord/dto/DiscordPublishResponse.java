package com.influencehub.backend.discord.dto;

public class DiscordPublishResponse {

    private final String status;
    private final String webhookUrl;

    public DiscordPublishResponse(String status, String webhookUrl) {
        this.status = status;
        this.webhookUrl = webhookUrl;
    }

    public String getStatus() {
        return status;
    }

    public String getWebhookUrl() {
        return webhookUrl;
    }
}
