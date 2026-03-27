package com.influencehub.backend.fan.api;

import com.influencehub.backend.fan.dto.CreateInviteLinkRequest;
import com.influencehub.backend.fan.dto.CreatorInviteDashboardResponse;
import com.influencehub.backend.fan.dto.InviteLinkDetailResponse;
import com.influencehub.backend.fan.dto.InviteLinkResponse;
import com.influencehub.backend.fan.service.FanInviteService;
import javax.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/invites")
public class InviteController {

    private final FanInviteService fanInviteService;

    public InviteController(FanInviteService fanInviteService) {
        this.fanInviteService = fanInviteService;
    }

    @PostMapping
    public InviteLinkResponse createInviteLink(
        @RequestHeader("Authorization") String authorizationHeader,
        @Valid @RequestBody CreateInviteLinkRequest request
    ) {
        return fanInviteService.createInviteLink(extractBearerToken(authorizationHeader), request);
    }

    @GetMapping("/mine")
    public CreatorInviteDashboardResponse myInvites(
        @RequestHeader("Authorization") String authorizationHeader
    ) {
        return fanInviteService.creatorDashboard(extractBearerToken(authorizationHeader));
    }

    @GetMapping("/{inviteCode}")
    public InviteLinkDetailResponse inviteDetail(@PathVariable String inviteCode) {
        return fanInviteService.openInvite(inviteCode);
    }

    private String extractBearerToken(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new IllegalArgumentException("유효한 Bearer 토큰이 필요합니다.");
        }
        return authorizationHeader.substring("Bearer ".length()).trim();
    }
}
