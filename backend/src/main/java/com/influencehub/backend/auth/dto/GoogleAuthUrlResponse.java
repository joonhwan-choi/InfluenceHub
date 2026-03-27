package com.influencehub.backend.auth.dto;

public class GoogleAuthUrlResponse {

    private final String authUrl;
    private final String redirectUri;

    public GoogleAuthUrlResponse(String authUrl, String redirectUri) {
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
