package com.influencehub.backend.room.api;

import com.influencehub.backend.room.dto.CreatorRoomSettingsResponse;
import com.influencehub.backend.room.dto.UpdateCreatorRoomSettingsRequest;
import com.influencehub.backend.room.service.CreatorRoomSettingsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/creator/settings")
public class CreatorRoomSettingsController {

    private final CreatorRoomSettingsService creatorRoomSettingsService;

    public CreatorRoomSettingsController(CreatorRoomSettingsService creatorRoomSettingsService) {
        this.creatorRoomSettingsService = creatorRoomSettingsService;
    }

    @GetMapping
    public CreatorRoomSettingsResponse getSettings(@RequestHeader("Authorization") String authorizationHeader) {
        return creatorRoomSettingsService.getSettings(extractBearerToken(authorizationHeader));
    }

    @PutMapping
    public CreatorRoomSettingsResponse updateSettings(
        @RequestHeader("Authorization") String authorizationHeader,
        @RequestBody UpdateCreatorRoomSettingsRequest request
    ) {
        return creatorRoomSettingsService.updateSettings(extractBearerToken(authorizationHeader), request);
    }

    private String extractBearerToken(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new IllegalArgumentException("유효한 Bearer 토큰이 필요합니다.");
        }
        return authorizationHeader.substring("Bearer ".length()).trim();
    }
}
