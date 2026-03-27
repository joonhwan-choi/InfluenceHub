package com.influencehub.backend.fan.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.influencehub.backend.fan.dto.FanAuthResponse;
import com.influencehub.backend.fan.dto.FanGoogleAuthUrlResponse;
import com.influencehub.backend.fan.dto.GoogleUserProfile;
import java.net.URI;
import java.util.Locale;
import java.util.Optional;
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
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class FanGoogleOAuthService {

    private static final String AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
    private static final String TOKEN_URL = "https://oauth2.googleapis.com/token";
    private static final String USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo";
    private static final String FAN_SCOPE = "openid email profile";

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final FanInviteService fanInviteService;
    private final FanSessionService fanSessionService;
    private final String clientId;
    private final String clientSecret;
    private final String redirectUri;

    public FanGoogleOAuthService(
        RestTemplate restTemplate,
        ObjectMapper objectMapper,
        FanInviteService fanInviteService,
        FanSessionService fanSessionService,
        @Value("${google.oauth.client-id:${youtube.client-id:}}") String clientId,
        @Value("${google.oauth.client-secret:${youtube.client-secret:}}") String clientSecret,
        @Value("${google.oauth.fan-redirect-uri:http://localhost:8080/api/v1/fans/oauth/callback}") String redirectUri
    ) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
        this.fanInviteService = fanInviteService;
        this.fanSessionService = fanSessionService;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.redirectUri = redirectUri;
    }

    public FanGoogleAuthUrlResponse buildAuthUrl(String inviteCode) {
        requireConfiguredCredentials();

        String state = inviteCode == null || inviteCode.isBlank()
            ? "fan-login"
            : "invite:" + inviteCode.trim();

        String authUrl = UriComponentsBuilder.fromHttpUrl(AUTH_URL)
            .queryParam("client_id", clientId)
            .queryParam("redirect_uri", redirectUri)
            .queryParam("response_type", "code")
            .queryParam("access_type", "offline")
            .queryParam("prompt", "select_account")
            .queryParam("scope", FAN_SCOPE)
            .queryParam("state", state)
            .build()
            .encode()
            .toUriString();

        return new FanGoogleAuthUrlResponse(authUrl, redirectUri);
    }

    public FanAuthResponse authenticate(String code, String state) {
        requireConfiguredCredentials();

        String accessToken = exchangeAccessToken(code);
        GoogleUserProfile profile = fetchUserProfile(accessToken);
        Optional<String> inviteCode = parseInviteCode(state);

        return inviteCode.isPresent()
            ? fanInviteService.joinInviteWithGoogle(inviteCode.get(), profile)
            : fanSessionService.loginWithGoogle(profile);
    }

    private String exchangeAccessToken(String code) {
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
        if (accessToken.isBlank()) {
            throw new IllegalStateException("Google access token을 받지 못했습니다.");
        }
        return accessToken;
    }

    private GoogleUserProfile fetchUserProfile(String accessToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        ResponseEntity<String> response = restTemplate.exchange(
            URI.create(USERINFO_URL),
            HttpMethod.GET,
            new HttpEntity<>(headers),
            String.class
        );

        JsonNode root = readJson(response.getBody());
        String email = textOrEmpty(root, "email").toLowerCase(Locale.ROOT);
        String name = textOrEmpty(root, "name");
        String picture = textOrEmpty(root, "picture");

        if (email.isBlank()) {
            throw new IllegalStateException("Google 계정 이메일을 읽지 못했습니다.");
        }

        return new GoogleUserProfile(
            email,
            name.isBlank() ? email.substring(0, email.indexOf('@')) : name,
            picture
        );
    }

    private Optional<String> parseInviteCode(String state) {
        if (state == null || state.isBlank()) {
            return Optional.empty();
        }

        if (!state.startsWith("invite:")) {
            return Optional.empty();
        }

        String inviteCode = state.substring("invite:".length()).trim();
        return inviteCode.isBlank() ? Optional.empty() : Optional.of(inviteCode);
    }

    private JsonNode readJson(String body) {
        try {
            return objectMapper.readTree(body == null ? "{}" : body);
        } catch (Exception ex) {
            throw new IllegalStateException("Google 응답을 해석하지 못했습니다.", ex);
        }
    }

    private String textOrEmpty(JsonNode node, String fieldName) {
        JsonNode child = node.path(fieldName);
        return child.isMissingNode() || child.isNull() ? "" : child.asText("");
    }

    private void requireConfiguredCredentials() {
        if (clientId == null || clientId.isBlank() || clientSecret == null || clientSecret.isBlank()) {
            throw new IllegalStateException("Google OAuth credentials are missing.");
        }
    }
}
