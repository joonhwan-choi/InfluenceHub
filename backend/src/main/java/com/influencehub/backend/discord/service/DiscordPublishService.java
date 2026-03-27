package com.influencehub.backend.discord.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.influencehub.backend.auth.domain.CreatorSession;
import com.influencehub.backend.auth.service.CreatorAuthService;
import com.influencehub.backend.discord.dto.DiscordPublishRequest;
import com.influencehub.backend.discord.dto.DiscordPublishResponse;
import com.influencehub.backend.room.domain.CreatorRoom;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

@Service
public class DiscordPublishService {

    private final CreatorAuthService creatorAuthService;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public DiscordPublishService(
        CreatorAuthService creatorAuthService,
        RestTemplate restTemplate,
        ObjectMapper objectMapper
    ) {
        this.creatorAuthService = creatorAuthService;
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    @Transactional
    public DiscordPublishResponse publish(String sessionToken, DiscordPublishRequest request) {
        CreatorSession session = creatorAuthService.requireSession(sessionToken);
        CreatorRoom room = session.getRoom();

        if (!room.isDiscordEnabled() || room.getDiscordWebhookUrl() == null || room.getDiscordWebhookUrl().isBlank()) {
            throw new IllegalStateException("Discord 웹훅이 설정되지 않았습니다.");
        }

        String title = request.getTitle() == null ? "" : request.getTitle().trim();
        String body = request.getBody() == null ? "" : request.getBody().trim();
        String targetUrl = request.getTargetUrl() == null ? "" : request.getTargetUrl().trim();

        if (title.isEmpty()) {
            throw new IllegalArgumentException("Discord로 보낼 제목이 필요합니다.");
        }

        ObjectNode payload = objectMapper.createObjectNode();
        payload.put("content", buildMessage(room.getRoomName(), title, body, targetUrl));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        restTemplate.postForEntity(
            room.getDiscordWebhookUrl(),
            new HttpEntity<>(payload.toString(), headers),
            String.class
        );

        return new DiscordPublishResponse("SENT", room.getDiscordWebhookUrl());
    }

    private String buildMessage(String roomName, String title, String body, String targetUrl) {
        StringBuilder builder = new StringBuilder();
        builder.append("**").append(roomName).append("**").append("\n");
        builder.append(title);
        if (!body.isEmpty()) {
            builder.append("\n").append(body);
        }
        if (!targetUrl.isEmpty()) {
            builder.append("\n").append(targetUrl);
        }
        return builder.toString();
    }
}
