package com.influencehub.backend.auth.api;

import com.influencehub.backend.auth.dto.CreatorAuthResponse;
import com.influencehub.backend.auth.service.CreatorAuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
public class CreatorAuthController {

    private final CreatorAuthService creatorAuthService;

    public CreatorAuthController(CreatorAuthService creatorAuthService) {
        this.creatorAuthService = creatorAuthService;
    }

    @GetMapping("/me")
    public CreatorAuthResponse me(@RequestHeader("Authorization") String authorizationHeader) {
        return creatorAuthService.currentSession(extractBearerToken(authorizationHeader));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestHeader("Authorization") String authorizationHeader) {
        creatorAuthService.logout(extractBearerToken(authorizationHeader));
        return ResponseEntity.noContent().build();
    }

    private String extractBearerToken(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new IllegalArgumentException("유효한 Bearer 토큰이 필요합니다.");
        }

        return authorizationHeader.substring("Bearer ".length()).trim();
    }
}
