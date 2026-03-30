package com.influencehub.backend.youtube.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.influencehub.backend.auth.dto.CreatorAuthResponse;
import com.influencehub.backend.auth.service.CreatorAuthService;
import com.influencehub.backend.community.service.CommunityAutomationService;
import com.influencehub.backend.publish.domain.PlatformType;
import com.influencehub.backend.publish.domain.PublishJob;
import com.influencehub.backend.publish.domain.PublishStatus;
import com.influencehub.backend.publish.repository.PublishJobRepository;
import com.influencehub.backend.room.domain.CreatorRoom;
import com.influencehub.backend.room.domain.RoomVisibility;
import com.influencehub.backend.room.repository.CreatorRoomRepository;
import com.influencehub.backend.user.domain.AuthProvider;
import com.influencehub.backend.user.domain.User;
import com.influencehub.backend.user.domain.UserRole;
import com.influencehub.backend.user.repository.UserRepository;
import com.influencehub.backend.youtube.dto.YoutubeAuthUrlResponse;
import com.influencehub.backend.youtube.dto.YoutubeChannelProfileResponse;
import com.influencehub.backend.youtube.dto.YoutubeCommentPublishRequest;
import com.influencehub.backend.youtube.dto.YoutubeCommentPublishResponse;
import com.influencehub.backend.youtube.dto.YoutubeConnectionResponse;
import com.influencehub.backend.youtube.dto.YoutubeConnectionSnapshotResponse;
import com.influencehub.backend.youtube.dto.YoutubeRecentVideoResponse;
import com.influencehub.backend.youtube.dto.YoutubeUploadResponse;
import com.influencehub.backend.youtube.domain.YoutubeChannelConnection;
import com.influencehub.backend.youtube.repository.YoutubeChannelConnectionRepository;
import com.influencehub.backend.youtube.support.YoutubeOnboardingContext;
import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import org.springframework.transaction.annotation.Transactional;
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
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class YoutubeIntegrationService {

    private static final String AUTH_SCOPE =
        "https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.force-ssl";
    private static final String AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
    private static final String TOKEN_URL = "https://oauth2.googleapis.com/token";
    private static final String CHANNELS_URL = "https://www.googleapis.com/youtube/v3/channels";
    private static final String PLAYLIST_ITEMS_URL = "https://www.googleapis.com/youtube/v3/playlistItems";
    private static final String VIDEO_UPLOAD_URL = "https://www.googleapis.com/upload/youtube/v3/videos";
    private static final String COMMENT_THREAD_URL = "https://www.googleapis.com/youtube/v3/commentThreads";

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final UserRepository userRepository;
    private final CreatorRoomRepository creatorRoomRepository;
    private final PublishJobRepository publishJobRepository;
    private final YoutubeChannelConnectionRepository youtubeChannelConnectionRepository;
    private final CreatorAuthService creatorAuthService;
    private final CommunityAutomationService communityAutomationService;
    private final String clientId;
    private final String clientSecret;
    private final String redirectUri;

    public YoutubeIntegrationService(
        RestTemplate restTemplate,
        ObjectMapper objectMapper,
        UserRepository userRepository,
        CreatorRoomRepository creatorRoomRepository,
        PublishJobRepository publishJobRepository,
        YoutubeChannelConnectionRepository youtubeChannelConnectionRepository,
        CreatorAuthService creatorAuthService,
        CommunityAutomationService communityAutomationService,
        @Value("${youtube.client-id:}") String clientId,
        @Value("${youtube.client-secret:}") String clientSecret,
        @Value("${youtube.redirect-uri:}") String redirectUri
    ) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
        this.userRepository = userRepository;
        this.creatorRoomRepository = creatorRoomRepository;
        this.publishJobRepository = publishJobRepository;
        this.youtubeChannelConnectionRepository = youtubeChannelConnectionRepository;
        this.creatorAuthService = creatorAuthService;
        this.communityAutomationService = communityAutomationService;
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
            .build()
            .encode()
            .toUriString();

        return new YoutubeAuthUrlResponse(authUrl, redirectUri);
    }

    @Transactional
    public YoutubeConnectionResponse exchangeCode(String code) {
        requireConfiguredCredentials();

        YoutubeTokenBundle tokenBundle = exchangeTokenBundle(code);
        YoutubeChannelProfileResponse channel = fetchMyChannel(tokenBundle.getAccessToken());
        persistConnection(channel, tokenBundle.getAccessToken(), tokenBundle.getRefreshToken());
        return new YoutubeConnectionResponse(tokenBundle.getAccessToken(), tokenBundle.getRefreshToken(), channel);
    }

    @Transactional
    public CreatorAuthResponse authenticateCreator(String code) {
        requireConfiguredCredentials();

        YoutubeTokenBundle tokenBundle = exchangeTokenBundle(code);
        YoutubeChannelProfileResponse channel = fetchMyChannel(tokenBundle.getAccessToken());
        YoutubeChannelConnection connection = persistConnection(
            channel,
            tokenBundle.getAccessToken(),
            tokenBundle.getRefreshToken()
        );
        return creatorAuthService.issueSession(connection);
    }

    private YoutubeTokenBundle exchangeTokenBundle(String code) {
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
        return new YoutubeTokenBundle(
            textOrEmpty(tokenJson, "access_token"),
            textOrEmpty(tokenJson, "refresh_token")
        );
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

    @Transactional
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

        String resolvedAccessToken = resolveAccessToken(accessToken);

        String resolvedPrivacyStatus = privacyStatus == null || privacyStatus.isBlank()
            ? "private"
            : privacyStatus;
        YoutubeChannelProfileResponse channel = fetchMyChannel(resolvedAccessToken);
        YoutubeOnboardingContext context = provisionContext(channel);
        PublishJob publishJob = publishJobRepository.save(
            new PublishJob(
                context.getRoom(),
                PlatformType.YOUTUBE,
                PublishStatus.READY,
                title,
                LocalDateTime.now()
            )
        );
        publishJob.markProcessing();

        try {
            String resumableUrl = initiateResumableUpload(
                resolvedAccessToken,
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
            String watchUrl = videoId.isBlank() ? "" : "https://www.youtube.com/watch?v=" + urlEncode(videoId);

            publishJob.markSuccess(watchUrl);
            String noticeTitle = communityAutomationService.createUploadNotice(
                context.getRoom(),
                context.getUser(),
                uploadedTitle,
                watchUrl,
                uploadedPrivacyStatus
            ).getTitle();

            return new YoutubeUploadResponse(
                videoId,
                uploadedTitle,
                uploadedPrivacyStatus,
                watchUrl,
                noticeTitle
            );
        } catch (RuntimeException ex) {
            publishJob.markFailed();
            throw ex;
        }
    }

    @Transactional
    public YoutubeCommentPublishResponse publishComment(
        String accessToken,
        YoutubeCommentPublishRequest request
    ) {
        String resolvedAccessToken = resolveAccessToken(accessToken);
        String videoId = extractVideoId(request.getVideoUrl());
        String message = request.getMessage() == null ? "" : request.getMessage().trim();

        if (videoId.isBlank()) {
            throw new IllegalArgumentException("댓글을 연결할 YouTube 영상 URL이 필요합니다.");
        }

        if (message.isEmpty()) {
            throw new IllegalArgumentException("댓글 본문이 필요합니다.");
        }

        HttpHeaders headers = authorizedHeaders(resolvedAccessToken);
        headers.setContentType(MediaType.APPLICATION_JSON);

        ObjectNode root = objectMapper.createObjectNode();
        ObjectNode snippet = root.putObject("snippet");
        snippet.put("videoId", videoId);
        ObjectNode topLevelComment = snippet.putObject("topLevelComment");
        ObjectNode topLevelCommentSnippet = topLevelComment.putObject("snippet");
        topLevelCommentSnippet.put("textOriginal", message);

        URI uri = UriComponentsBuilder.fromHttpUrl(COMMENT_THREAD_URL)
            .queryParam("part", "snippet")
            .build(true)
            .toUri();

        ResponseEntity<String> response;
        try {
            response = restTemplate.exchange(
                uri,
                HttpMethod.POST,
                new HttpEntity<>(root.toString(), headers),
                String.class
            );
        } catch (HttpClientErrorException.Forbidden ex) {
            throw new IllegalStateException("댓글 배포 권한이 부족합니다. YouTube를 다시 연결해 주세요.", ex);
        }

        JsonNode responseJson = readJson(response.getBody());
        String commentId = textOrEmpty(responseJson.path("snippet").path("topLevelComment"), "id");
        String commentUrl = commentId.isBlank()
            ? "https://www.youtube.com/watch?v=" + urlEncode(videoId)
            : "https://www.youtube.com/watch?v=" + urlEncode(videoId) + "&lc=" + urlEncode(commentId);

        return new YoutubeCommentPublishResponse(videoId, commentId, commentUrl, message);
    }

    private String resolveAccessToken(String accessToken) {
        if (accessToken != null && !accessToken.isBlank()) {
            return accessToken;
        }

        requireConfiguredCredentials();
        YoutubeChannelConnection connection = youtubeChannelConnectionRepository.findTopByOrderByCreatedAtDesc()
            .orElseThrow(() -> new IllegalStateException("No saved YouTube connection exists yet."));

        if (connection.getRefreshToken() != null && !connection.getRefreshToken().isBlank()) {
            String refreshedAccessToken = refreshAccessToken(connection.getRefreshToken());
            connection.updateChannelMetadata(
                connection.getChannelTitle(),
                connection.getChannelDescription(),
                connection.getCustomUrl(),
                connection.getThumbnailUrl(),
                connection.getSubscriberCount(),
                refreshedAccessToken,
                connection.getRefreshToken()
            );
            return refreshedAccessToken;
        }

        if (connection.getAccessToken() == null || connection.getAccessToken().isBlank()) {
            throw new IllegalStateException("The latest YouTube connection does not have a valid access token.");
        }

        return connection.getAccessToken();
    }

    private String refreshAccessToken(String refreshToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("client_id", clientId);
        body.add("client_secret", clientSecret);
        body.add("refresh_token", refreshToken);
        body.add("grant_type", "refresh_token");

        ResponseEntity<String> tokenResponse = restTemplate.postForEntity(
            TOKEN_URL,
            new HttpEntity<>(body, headers),
            String.class
        );

        JsonNode tokenJson = readJson(tokenResponse.getBody());
        String nextAccessToken = textOrEmpty(tokenJson, "access_token");
        if (nextAccessToken.isBlank()) {
            throw new IllegalStateException("Failed to refresh the YouTube access token.");
        }

        return nextAccessToken;
    }

    @Transactional(readOnly = true)
    public YoutubeConnectionSnapshotResponse latestConnection() {
        YoutubeChannelConnection connection = youtubeChannelConnectionRepository.findTopByOrderByCreatedAtDesc()
            .orElseThrow(() -> new IllegalStateException("No saved YouTube connection exists yet."));

        return new YoutubeConnectionSnapshotResponse(
            connection.getId(),
            connection.getYoutubeChannelId(),
            connection.getChannelTitle(),
            connection.getChannelDescription(),
            connection.getRoom().getRoomName(),
            connection.getRoom().getSlug(),
            connection.getSubscriberCount()
        );
    }

    @Transactional(readOnly = true)
    public List<YoutubeRecentVideoResponse> latestVideos(int limit) {
        String resolvedAccessToken = resolveAccessToken(null);
        String uploadsPlaylistId = fetchUploadsPlaylistId(resolvedAccessToken);
        HttpHeaders headers = authorizedHeaders(resolvedAccessToken);
        int safeLimit = Math.max(1, Math.min(limit, 6));

        URI uri = UriComponentsBuilder.fromHttpUrl(PLAYLIST_ITEMS_URL)
            .queryParam("part", "snippet,contentDetails,status")
            .queryParam("playlistId", uploadsPlaylistId)
            .queryParam("maxResults", safeLimit)
            .build(true)
            .toUri();

        ResponseEntity<String> response = restTemplate.exchange(
            uri,
            HttpMethod.GET,
            new HttpEntity<>(headers),
            String.class
        );

        JsonNode root = readJson(response.getBody());
        JsonNode items = root.path("items");
        List<YoutubeRecentVideoResponse> videos = new ArrayList<>();
        if (!items.isArray()) {
            return videos;
        }

        for (JsonNode item : items) {
            JsonNode snippet = item.path("snippet");
            JsonNode thumbnails = snippet.path("thumbnails");
            String videoId = firstNonEmpty(
                textOrEmpty(item.path("contentDetails"), "videoId"),
                textOrEmpty(snippet.path("resourceId"), "videoId")
            );
            String thumbnailUrl = firstNonEmpty(
                textOrEmpty(thumbnails.path("maxres"), "url"),
                textOrEmpty(thumbnails.path("standard"), "url"),
                textOrEmpty(thumbnails.path("high"), "url"),
                textOrEmpty(thumbnails.path("medium"), "url"),
                textOrEmpty(thumbnails.path("default"), "url")
            );
            videos.add(new YoutubeRecentVideoResponse(
                videoId,
                textOrEmpty(snippet, "title"),
                textOrEmpty(snippet, "description"),
                thumbnailUrl,
                videoId.isBlank() ? "" : "https://www.youtube.com/watch?v=" + urlEncode(videoId),
                textOrEmpty(snippet, "publishedAt"),
                textOrEmpty(snippet, "liveBroadcastContent")
            ));
        }

        return videos;
    }

    private String fetchUploadsPlaylistId(String accessToken) {
        HttpHeaders headers = authorizedHeaders(accessToken);
        URI uri = UriComponentsBuilder.fromHttpUrl(CHANNELS_URL)
            .queryParam("part", "contentDetails")
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

        String uploadsPlaylistId = textOrEmpty(
            firstItem.path("contentDetails").path("relatedPlaylists"),
            "uploads"
        );

        if (uploadsPlaylistId.isBlank()) {
            throw new IllegalStateException("The authenticated YouTube channel does not expose an uploads playlist.");
        }

        return uploadsPlaylistId;
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

    private YoutubeChannelConnection persistConnection(
        YoutubeChannelProfileResponse channel,
        String accessToken,
        String refreshToken
    ) {
        YoutubeOnboardingContext context = provisionContext(channel);
        return youtubeChannelConnectionRepository.findByYoutubeChannelId(channel.getChannelId())
            .map(connection -> {
                connection.updateChannelMetadata(
                    channel.getTitle(),
                    channel.getDescription(),
                    channel.getCustomUrl(),
                    channel.getThumbnailUrl(),
                    channel.getSubscriberCount(),
                    accessToken,
                    refreshToken
                );
                return connection;
            })
            .orElseGet(() -> youtubeChannelConnectionRepository.save(
                new YoutubeChannelConnection(
                    context.getUser(),
                    context.getRoom(),
                    channel.getChannelId(),
                    channel.getTitle(),
                    channel.getDescription(),
                    channel.getCustomUrl(),
                    channel.getThumbnailUrl(),
                    channel.getSubscriberCount(),
                    accessToken,
                    refreshToken
                )
            ));
    }

    private YoutubeOnboardingContext provisionContext(YoutubeChannelProfileResponse channel) {
        String normalizedTitle = channel.getTitle().isBlank() ? "creator" : channel.getTitle();
        String slug = slugify(channel.getCustomUrl().isBlank() ? normalizedTitle : channel.getCustomUrl());
        String email = slug + "@youtube.influencehub.local";

        User user = userRepository.findByEmail(email)
            .map(existing -> {
                existing.updateProfile(normalizedTitle, channel.getThumbnailUrl());
                return existing;
            })
            .orElseGet(() -> userRepository.save(
                new User(email, normalizedTitle, UserRole.CREATOR, AuthProvider.YOUTUBE)
            ));

        CreatorRoom room = creatorRoomRepository.findByOwner(user)
            .map(existing -> {
                existing.updateProfile(normalizedTitle, defaultDescription(channel));
                return existing;
            })
            .orElseGet(() -> creatorRoomRepository.save(
                new CreatorRoom(
                    user,
                    normalizedTitle,
                    ensureUniqueSlug(slug),
                    defaultDescription(channel),
                    RoomVisibility.PUBLIC
                )
            ));

        return new YoutubeOnboardingContext(user, room);
    }

    private String ensureUniqueSlug(String baseSlug) {
        String candidate = baseSlug;
        int suffix = 2;
        while (creatorRoomRepository.existsBySlug(candidate)) {
            candidate = baseSlug + "-" + suffix;
            suffix++;
        }
        return candidate;
    }

    private String defaultDescription(YoutubeChannelProfileResponse channel) {
        return channel.getDescription().isBlank()
            ? channel.getTitle() + " 공식 팬방입니다."
            : channel.getDescription();
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

    private String extractVideoId(String videoUrl) {
        if (videoUrl == null || videoUrl.isBlank()) {
            return "";
        }

        String normalized = videoUrl.trim();
        if (!normalized.startsWith("http")) {
            return normalized;
        }

        try {
            URI uri = URI.create(normalized);
            String host = uri.getHost() == null ? "" : uri.getHost().toLowerCase(Locale.ROOT);
            String path = uri.getPath() == null ? "" : uri.getPath();

            if (host.contains("youtu.be")) {
                return path.replaceFirst("^/", "");
            }

            if (host.contains("youtube.com")) {
                String query = uri.getQuery();
                if (query != null) {
                    for (String token : query.split("&")) {
                        String[] entry = token.split("=", 2);
                        if (entry.length == 2 && "v".equals(entry[0])) {
                            return entry[1];
                        }
                    }
                }
            }
        } catch (RuntimeException ignored) {
            return normalized;
        }

        return normalized;
    }

    private String slugify(String value) {
        String normalized = value.toLowerCase(Locale.ROOT)
            .replaceAll("[^a-z0-9]+", "-")
            .replaceAll("(^-+|-+$)", "");
        return normalized.isBlank() ? "creator-room" : normalized;
    }

    private static class YoutubeTokenBundle {

        private final String accessToken;
        private final String refreshToken;

        private YoutubeTokenBundle(String accessToken, String refreshToken) {
            this.accessToken = accessToken;
            this.refreshToken = refreshToken;
        }

        private String getAccessToken() {
            return accessToken;
        }

        private String getRefreshToken() {
            return refreshToken;
        }
    }
}
