package com.influencehub.backend.instagram.api;

import com.influencehub.backend.instagram.dto.InstagramPublishRequest;
import com.influencehub.backend.instagram.dto.InstagramPublishResponse;
import com.influencehub.backend.instagram.service.InstagramPublishService;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/instagram")
public class InstagramPublishController {

    private final InstagramPublishService instagramPublishService;

    public InstagramPublishController(InstagramPublishService instagramPublishService) {
        this.instagramPublishService = instagramPublishService;
    }

    @PostMapping("/publish")
    public ResponseEntity<?> publish(
        @RequestHeader("Authorization") String authorizationHeader,
        @RequestBody InstagramPublishRequest request
    ) {
        try {
            InstagramPublishResponse response = instagramPublishService.publish(
                extractToken(authorizationHeader),
                request
            );
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException | IllegalStateException ex) {
            return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
        }
    }

    private String extractToken(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new IllegalArgumentException("인플루언서 인증 토큰이 필요합니다.");
        }
        return authorizationHeader.substring(7);
    }
}
