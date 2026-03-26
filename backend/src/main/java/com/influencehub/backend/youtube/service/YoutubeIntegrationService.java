package com.influencehub.backend.youtube.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.influencehub.backend.youtube.dto.YoutubeAuthUrlResponse;
import com.influencehub.backend.youtube.dto.YoutubeChannelProfileResponse;
import com.influencehub.backend.youtube.dto.YoutubeConnectionResponse;
import com.influencehub.backend.youtube.dto.YoutubeUploadResponse;
import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class YoutubeIntegrationService {

    private static final String AUTH_SCOPE =
        "https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube.upload";
    private static final String AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
    private static final String TOKEN_URL = "https://oauth2.googleapis.com/token";
    private static final String CHANNELS_URL = "https://www.googleapis.com/youtube/v3/channels";
    private static final String VIDEO_UPLOAD_URL = "https://www.googleapis.com/upload/youtube/v3/videos";

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final String clientId;
    private final String clientSecret;
    private final String redirectUri;

    public YoutubeIntegrationService(
        RestTemplate restTemplate,
        ObjectMapper objectMapper,
        @Value("${youtube.client-id:}") String clientId,
        @Value("${youtube.client-secret:}") String clientSecret,
        @Value("${youtube.redirect-uri:}") String redirectUri
    ) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.redirectUri = redirectUri;
    }

    public YoutubeAuthUrlResponse buildAuthUrl() {
        requireConfiguredCredentials();

        String authUrl = UriComponentsBuilder.fromHttpUrl(AUTH_URL)
            .queryParam("client_id", clientId)
            .queryParam("redirect_uri", redirectUri)
            .queryParam("response_type", "code")
            .queryParam("access_type", "offline")
            .queryParam("prompt", "consent")
            .queryParam("include_granted_scopes", "true")
            .queryParam("scope", AUTH_SCOPE)
            .build(true)
            .toUriString();

        return new YoutubeAuthUrlResponse(authUrl, redirectUri);
    }

    public YoutubeConnectionResponse exchangeCode(String code) {
        requireConfiguredCredentials();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("code", code);
        body.add("client_id", clientId);
        body.add("client_secret", clientSecret);
        body.add("redirect_uri", redirectUri);
        body.add("grant_type", "authorization_code");

        ResponseEntity<String> tokenResponse = restTemplate.postForEntity(
            TOKEN_URL,
            new HttpEntity<>(body, headers),
            String.class
        );

        JsonNode tokenJson = readJson(tokenResponse.getBody());
        String accessToken = textOrEmpty(tokenJson, "access_token");
        String refreshToken = textOrEmpty(tokenJson, "refresh_token");

        YoutubeChannelProfileResponse channel = fetchMyChannel(accessToken);
        return new YoutubeConnectionResponse(accessToken, refreshToken, channel);
    }

    public YoutubeChannelProfileResponse fetchMyChannel(String accessToken) {
        HttpHeaders headers = authorizedHeaders(accessToken);
        URI uri = UriComponentsBuilder.fromHttpUrl(CHANNELS_URL)
            .queryParam("part", "snippet,statistics")
            .queryParam("mine", "true")
            .build(true)
            .toUri();

        ResponseEntity<String> response = restTemplate.exchange(
            uri,
            HttpMethod.GET,
            new HttpEntity<>(headers),
            String.class
        );

        JsonNode root = readJson(response.getBody());
        JsonNode firstItem = root.path("items").isArray() && root.path("items").size() > 0
            ? root.path("items").get(0)
            : null;

        if (firstItem == null || firstItem.isMissingNode()) {
            throw new IllegalStateException("No YouTube channel was returned for the authenticated account.");
        }

        JsonNode snippet = firstItem.path("snippet");
        JsonNode thumbnails = snippet.path("thumbnails");
        String thumbnailUrl = firstNonEmpty(
            textOrEmpty(thumbnails.path("high"), "url"),
            textOrEmpty(thumbnails.path("medium"), "url"),
            textOrEmpty(thumbnails.path("default"), "url")
        );

        return new YoutubeChannelProfileResponse(
            textOrEmpty(firstItem, "id"),
            textOrEmpty(snippet, "title"),
            textOrEmpty(snippet, "description"),
            textOrEmpty(snippet, "customUrl"),
            thumbnailUrl,
            textOrEmpty(firstItem.path("statistics"), "subscriberCount")
        );
    }

    public YoutubeUploadResponse uploadVideo(
        String accessToken,
        String title,
        String description,
        String privacyStatus,
        MultipartFile file
    ) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("A video file is required.");
        }

        String resolvedPrivacyStatus = privacyStatus == null || privacyStatus.isBlank()
            ? "private"
            : privacyStatus;

        String resumableUrl = initiateResumableUpload(
            accessToken,
            title,
            description,
            resolvedPrivacyStatus,
            file.getContentType(),
            file.getSize()
        );

        HttpHeaders uploadHeaders = new HttpHeaders();
        uploadHeaders.setContentType(file.getContentType() == null
            ? MediaType.APPLICATION_OCTET_STREAM
            : MediaType.parseMediaType(file.getContentType()));
        uploadHeaders.setContentLength(file.getSize());

        ResponseEntity<String> uploadResponse = restTemplate.exchange(
            URI.create(resumableUrl),
            HttpMethod.PUT,
            new HttpEntity<>(file.getBytes(), uploadHeaders),
            String.class
        );

        JsonNode root = readJson(uploadResponse.getBody());
        String videoId = textOrEmpty(root, "id");
        String uploadedTitle = textOrEmpty(root.path("snippet"), "title");
        String uploadedPrivacyStatus = textOrEmpty(root.path("status"), "privacyStatus");

        return new YoutubeUploadResponse(
            videoId,
            uploadedTitle,
            uploadedPrivacyStatus,
            videoId.isBlank() ? "" : "https://www.youtube.com/watch?v=" + urlEncode(videoId)
        );
    }

    private String initiateResumableUpload(
        String accessToken,
        String title,
        String description,
        String privacyStatus,
        String contentType,
        long contentLength
    ) {
        HttpHeaders headers = authorizedHeaders(accessToken);
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.add("X-Upload-Content-Type", contentType == null ? "application/octet-stream" : contentType);
        headers.add("X-Upload-Content-Length", String.valueOf(contentLength));

        ObjectNode metadata = objectMapper.createObjectNode();
        ObjectNode snippet = metadata.putObject("snippet");
        snippet.put("title", title);
        snippet.put("description", description == null ? "" : description);
        ObjectNode status = metadata.putObject("status");
        status.put("privacyStatus", privacyStatus);

        URI uri = UriComponentsBuilder.fromHttpUrl(VIDEO_UPLOAD_URL)
            .queryParam("uploadType", "resumable")
            .queryParam("part", "snippet,status")
            .build(true)
            .toUri();

        ResponseEntity<String> response = restTemplate.exchange(
            uri,
            HttpMethod.POST,
            new HttpEntity<>(metadata.toString(), headers),
            String.class
        );

        String location = response.getHeaders().getFirst("Location");
        if (location == null || location.isBlank()) {
            throw new IllegalStateException("Google did not return a resumable upload location.");
        }

        return location;
    }

    private HttpHeaders authorizedHeaders(String accessToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        return headers;
    }

    private void requireConfiguredCredentials() {
        if (clientId.isBlank() || clientSecret.isBlank() || redirectUri.isBlank()) {
            throw new IllegalStateException(
                "YouTube OAuth credentials are missing. Set YOUTUBE_CLIENT_ID, YOUTUBE_CLIENT_SECRET, and YOUTUBE_REDIRECT_URI."
            );
        }
    }

    private JsonNode readJson(String body) {
        try {
            return objectMapper.readTree(body == null ? "{}" : body);
        } catch (IOException e) {
            throw new IllegalStateException("Failed to parse Google API response.", e);
        }
    }

    private String textOrEmpty(JsonNode node, String fieldName) {
        JsonNode value = node.path(fieldName);
        return value.isMissingNode() || value.isNull() ? "" : value.asText("");
    }

    private String firstNonEmpty(String... values) {
        for (String value : values) {
            if (value != null && !value.isBlank()) {
                return value;
            }
        }
        return "";
    }

    private String urlEncode(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8);
    }
}
