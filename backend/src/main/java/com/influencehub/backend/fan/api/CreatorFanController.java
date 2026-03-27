package com.influencehub.backend.fan.api;

import com.influencehub.backend.fan.dto.CreatorFanMemberResponse;
import com.influencehub.backend.fan.dto.UpdateFanTierRequest;
import com.influencehub.backend.fan.service.FanInviteService;
import java.util.List;
import javax.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/creator/fans")
public class CreatorFanController {

    private final FanInviteService fanInviteService;

    public CreatorFanController(FanInviteService fanInviteService) {
        this.fanInviteService = fanInviteService;
    }

    @GetMapping
    public List<CreatorFanMemberResponse> members(
        @RequestHeader("Authorization") String authorizationHeader
    ) {
        return fanInviteService.creatorFanMembers(extractBearerToken(authorizationHeader));
    }

    @PatchMapping("/{membershipId}/tier")
    public CreatorFanMemberResponse updateTier(
        @RequestHeader("Authorization") String authorizationHeader,
        @PathVariable Long membershipId,
        @Valid @RequestBody UpdateFanTierRequest request
    ) {
        return fanInviteService.updateFanTier(
            extractBearerToken(authorizationHeader),
            membershipId,
            request
        );
    }

    private String extractBearerToken(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new IllegalArgumentException("유효한 Bearer 토큰이 필요합니다.");
        }
        return authorizationHeader.substring("Bearer ".length()).trim();
    }
}
