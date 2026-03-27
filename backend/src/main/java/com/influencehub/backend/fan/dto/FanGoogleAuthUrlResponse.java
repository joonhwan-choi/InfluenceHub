package com.influencehub.backend.fan.dto;

public class FanGoogleAuthUrlResponse {

    private final String authUrl;
    private final String redirectUri;

    public FanGoogleAuthUrlResponse(String authUrl, String redirectUri) {
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
