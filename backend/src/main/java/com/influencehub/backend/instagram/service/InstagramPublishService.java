package com.influencehub.backend.instagram.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.influencehub.backend.auth.domain.CreatorSession;
import com.influencehub.backend.auth.service.CreatorAuthService;
import com.influencehub.backend.instagram.dto.InstagramPublishRequest;
import com.influencehub.backend.instagram.dto.InstagramPublishResponse;
import com.influencehub.backend.room.domain.CreatorRoom;
import java.net.URI;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class InstagramPublishService {

    private static final String GRAPH_API_BASE_URL = "https://graph.facebook.com/v22.0";

    private final CreatorAuthService creatorAuthService;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public InstagramPublishService(
        CreatorAuthService creatorAuthService,
        RestTemplate restTemplate,
        ObjectMapper objectMapper
    ) {
        this.creatorAuthService = creatorAuthService;
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    @Transactional(readOnly = true)
    public InstagramPublishResponse publish(String sessionToken, InstagramPublishRequest request) {
        CreatorSession session = creatorAuthService.requireSession(sessionToken);
        CreatorRoom room = session.getRoom();

        if (!room.isInstagramEnabled()) {
            throw new IllegalStateException("Instagram 채널이 아직 활성화되지 않았습니다.");
        }

        if (room.getInstagramAccountId() == null || room.getInstagramAccountId().isBlank()) {
            throw new IllegalStateException("Instagram Account ID가 설정되지 않았습니다.");
        }

        if (room.getInstagramAccessToken() == null || room.getInstagramAccessToken().isBlank()) {
            throw new IllegalStateException("Instagram Access Token이 설정되지 않았습니다.");
        }

        String mediaUrl = normalize(request.getMediaUrl());
        String caption = buildCaption(normalize(request.getTitle()), normalize(request.getCaption()), room.getRoomName());

        if (mediaUrl.isBlank()) {
            throw new IllegalArgumentException("Instagram 게시글 발행에는 공개 이미지 URL이 필요합니다.");
        }

        try {
            String creationId = createMediaContainer(room.getInstagramAccountId(), room.getInstagramAccessToken(), mediaUrl, caption);
            String mediaId = publishMedia(room.getInstagramAccountId(), room.getInstagramAccessToken(), creationId);
            String permalink = fetchPermalink(mediaId, room.getInstagramAccessToken());
            return new InstagramPublishResponse("PUBLISHED", mediaId, permalink);
        } catch (HttpStatusCodeException ex) {
            throw new IllegalStateException(extractErrorMessage(ex.getResponseBodyAsString()));
        }
    }

    private String createMediaContainer(String accountId, String accessToken, String mediaUrl, String caption) {
        String endpoint = UriComponentsBuilder.fromHttpUrl(GRAPH_API_BASE_URL)
            .pathSegment(accountId, "media")
            .toUriString();

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("image_url", mediaUrl);
        body.add("caption", caption);
        body.add("access_token", accessToken);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        String response = restTemplate.postForObject(
            endpoint,
            new HttpEntity<>(body, headers),
            String.class
        );

        return readRequiredField(response, "id");
    }

    private String publishMedia(String accountId, String accessToken, String creationId) {
        String endpoint = UriComponentsBuilder.fromHttpUrl(GRAPH_API_BASE_URL)
            .pathSegment(accountId, "media_publish")
            .toUriString();

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("creation_id", creationId);
        body.add("access_token", accessToken);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        String response = restTemplate.postForObject(
            endpoint,
            new HttpEntity<>(body, headers),
            String.class
        );

        return readRequiredField(response, "id");
    }

    private String fetchPermalink(String mediaId, String accessToken) {
        URI endpoint = UriComponentsBuilder.fromHttpUrl(GRAPH_API_BASE_URL)
            .pathSegment(mediaId)
            .queryParam("fields", "permalink")
            .queryParam("access_token", accessToken)
            .build()
            .encode()
            .toUri();

        String response = restTemplate.getForObject(endpoint, String.class);
        return readRequiredField(response, "permalink");
    }

    private String readRequiredField(String rawJson, String fieldName) {
        try {
            JsonNode root = objectMapper.readTree(rawJson);
            String value = root.path(fieldName).asText("");
            if (value.isBlank()) {
                throw new IllegalStateException("Instagram 응답에서 " + fieldName + " 값을 읽지 못했습니다.");
            }
            return value;
        } catch (Exception ex) {
            if (ex instanceof IllegalStateException) {
                throw (IllegalStateException) ex;
            }
            throw new IllegalStateException("Instagram 응답 해석에 실패했습니다.");
        }
    }

    private String extractErrorMessage(String rawJson) {
        try {
            JsonNode root = objectMapper.readTree(rawJson);
            String message = root.path("error").path("message").asText("");
            if (!message.isBlank()) {
                return message;
            }
        } catch (Exception ignored) {
        }
        return "Instagram 게시글 배포에 실패했습니다.";
    }

    private String buildCaption(String title, String caption, String roomName) {
        StringBuilder builder = new StringBuilder();
        if (!title.isBlank()) {
            builder.append(title);
        }
        if (!caption.isBlank()) {
            if (builder.length() > 0) {
                builder.append("\n\n");
            }
            builder.append(caption);
        }
        if (builder.length() == 0) {
            builder.append(roomName).append(" 업데이트");
        }
        return builder.toString();
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim();
    }
}
