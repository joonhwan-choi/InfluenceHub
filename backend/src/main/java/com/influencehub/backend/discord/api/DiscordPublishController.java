package com.influencehub.backend.discord.api;

import com.influencehub.backend.discord.dto.DiscordPublishRequest;
import com.influencehub.backend.discord.dto.DiscordPublishResponse;
import com.influencehub.backend.discord.service.DiscordPublishService;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/discord")
public class DiscordPublishController {

    private final DiscordPublishService discordPublishService;

    public DiscordPublishController(DiscordPublishService discordPublishService) {
        this.discordPublishService = discordPublishService;
    }

    @PostMapping("/publish")
    public ResponseEntity<?> publish(
        @RequestHeader("Authorization") String authorizationHeader,
        @RequestBody DiscordPublishRequest request
    ) {
        try {
            DiscordPublishResponse response = discordPublishService.publish(
                extractBearerToken(authorizationHeader),
                request
            );
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException | IllegalStateException ex) {
            return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
        }
    }

    private String extractBearerToken(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new IllegalArgumentException("유효한 Bearer 토큰이 필요합니다.");
        }
        return authorizationHeader.substring("Bearer ".length()).trim();
    }
}
