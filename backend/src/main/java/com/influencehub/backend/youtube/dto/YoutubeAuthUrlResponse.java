package com.influencehub.backend.youtube.dto;

public class YoutubeAuthUrlResponse {

    private final String authUrl;
    private final String redirectUri;

    public YoutubeAuthUrlResponse(String authUrl, String redirectUri) {
        this.authUrl = authUrl;
        this.redirectUri = redirectUri;
    }

    public String getAuthUrl() {
        return authUrl;
    }

    public String getRedirectUri() {
        return redirectUri;
    }
}
