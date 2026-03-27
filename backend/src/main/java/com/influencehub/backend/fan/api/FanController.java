package com.influencehub.backend.fan.api;

import com.influencehub.backend.fan.dto.FanAuthResponse;
import com.influencehub.backend.fan.dto.FanJoinInviteRequest;
import com.influencehub.backend.fan.service.FanInviteService;
import com.influencehub.backend.fan.service.FanSessionService;
import javax.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/fans")
public class FanController {

    private final FanInviteService fanInviteService;
    private final FanSessionService fanSessionService;

    public FanController(FanInviteService fanInviteService, FanSessionService fanSessionService) {
        this.fanInviteService = fanInviteService;
        this.fanSessionService = fanSessionService;
    }

    @PostMapping("/join")
    public FanAuthResponse join(@Valid @RequestBody FanJoinInviteRequest request) {
        return fanInviteService.joinInvite(request);
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

    private String extractBearerToken(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new IllegalArgumentException("유효한 Bearer 토큰이 필요합니다.");
        }
        return authorizationHeader.substring("Bearer ".length()).trim();
    }
}
