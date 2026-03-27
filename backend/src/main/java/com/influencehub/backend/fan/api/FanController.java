package com.influencehub.backend.fan.api;

import com.influencehub.backend.fan.dto.FanAuthResponse;
import com.influencehub.backend.fan.dto.FanGoogleAuthUrlResponse;
import com.influencehub.backend.fan.dto.FanJoinInviteRequest;
import com.influencehub.backend.fan.service.FanGoogleOAuthService;
import com.influencehub.backend.fan.service.FanInviteService;
import com.influencehub.backend.fan.service.FanSessionService;
import java.net.URI;
import java.util.Optional;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

@RestController
@RequestMapping("/api/v1/fans")
public class FanController {

    private final FanInviteService fanInviteService;
    private final FanSessionService fanSessionService;
    private final FanGoogleOAuthService fanGoogleOAuthService;
    private final String frontendUrl;

    public FanController(
        FanInviteService fanInviteService,
        FanSessionService fanSessionService,
        FanGoogleOAuthService fanGoogleOAuthService,
        @Value("${app.frontend-url:http://localhost:5173}") String frontendUrl
    ) {
        this.fanInviteService = fanInviteService;
        this.fanSessionService = fanSessionService;
        this.fanGoogleOAuthService = fanGoogleOAuthService;
        this.frontendUrl = frontendUrl;
    }

    @PostMapping("/join")
    public FanAuthResponse join(@Valid @RequestBody FanJoinInviteRequest request) {
        return fanInviteService.joinInvite(request);
    }

    @GetMapping("/auth-url")
    public FanGoogleAuthUrlResponse authUrl(
        @RequestParam(value = "inviteCode", required = false) String inviteCode
    ) {
        return fanGoogleOAuthService.buildAuthUrl(inviteCode);
    }

    @GetMapping("/oauth/callback")
    public ResponseEntity<Void> callback(
        @RequestParam("code") String code,
        @RequestParam(value = "state", required = false) String state
    ) {
        try {
            FanAuthResponse authResponse = fanGoogleOAuthService.authenticate(code, state);
            return buildRedirect("connected", "", authResponse.getSessionToken());
        } catch (RuntimeException ex) {
            return buildRedirect("error", ex.getMessage(), "");
        }
    }
    @GetMapping("/me")
    public FanAuthResponse me(@RequestHeader("Authorization") String authorizationHeader) {
        return fanSessionService.currentSession(extractBearerToken(authorizationHeader));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestHeader("Authorization") String authorizationHeader) {
        fanSessionService.logout(extractBearerToken(authorizationHeader));
        return ResponseEntity.noContent().build();
    }

    private ResponseEntity<Void> buildRedirect(String fanState, String message, String appToken) {
        String redirectUrl = UriComponentsBuilder.fromUriString(frontendUrl)
            .queryParam("view", "fan")
            .queryParam("fan", fanState)
            .queryParamIfPresent(
                "fanAppToken",
                appToken == null || appToken.isBlank()
                    ? Optional.empty()
                    : Optional.of(appToken)
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

    private String extractBearerToken(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new IllegalArgumentException("유효한 Bearer 토큰이 필요합니다.");
        }
        return authorizationHeader.substring("Bearer ".length()).trim();
    }
}
