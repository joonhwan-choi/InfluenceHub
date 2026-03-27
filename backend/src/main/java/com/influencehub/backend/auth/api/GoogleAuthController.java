package com.influencehub.backend.auth.api;

import com.influencehub.backend.auth.dto.GoogleAuthUrlResponse;
import com.influencehub.backend.auth.service.GoogleIdentityService;
import com.influencehub.backend.fan.dto.GoogleUserProfile;
import java.net.URI;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

@RestController
@RequestMapping("/api/v1/auth/google")
public class GoogleAuthController {

    private final GoogleIdentityService googleIdentityService;
    private final String frontendUrl;

    public GoogleAuthController(
        GoogleIdentityService googleIdentityService,
        @Value("${app.frontend-url:http://localhost:5173}") String frontendUrl
    ) {
        this.googleIdentityService = googleIdentityService;
        this.frontendUrl = frontendUrl;
    }

    @GetMapping("/auth-url")
    public GoogleAuthUrlResponse authUrl() {
        return new GoogleAuthUrlResponse(
            googleIdentityService.buildAuthUrl(),
            googleIdentityService.getRedirectUri()
        );
    }

    @GetMapping("/callback")
    public ResponseEntity<Void> callback(@RequestParam("code") String code) {
        try {
            GoogleUserProfile profile = googleIdentityService.authenticate(code);
            return buildRedirect("connected", "", profile);
        } catch (RuntimeException ex) {
            return buildRedirect("error", ex.getMessage(), null);
        }
    }

    private ResponseEntity<Void> buildRedirect(String googleState, String message, GoogleUserProfile profile) {
        String redirectUrl = UriComponentsBuilder.fromUriString(frontendUrl)
            .queryParam("view", "signup")
            .queryParam("google", googleState)
            .queryParamIfPresent(
                "googleEmail",
                profile == null ? Optional.empty() : Optional.ofNullable(profile.getEmail())
            )
            .queryParamIfPresent(
                "googleName",
                profile == null ? Optional.empty() : Optional.ofNullable(profile.getName())
            )
            .queryParamIfPresent(
                "googlePicture",
                profile == null ? Optional.empty() : Optional.ofNullable(profile.getPicture())
            )
            .queryParamIfPresent(
                "message",
                message == null || message.isBlank()
                    ? Optional.empty()
                    : Optional.of(message)
            )
            .build()
            .encode()
            .toUriString();

        return ResponseEntity.status(HttpStatus.FOUND)
            .header(HttpHeaders.LOCATION, URI.create(redirectUrl).toString())
            .build();
    }
}
