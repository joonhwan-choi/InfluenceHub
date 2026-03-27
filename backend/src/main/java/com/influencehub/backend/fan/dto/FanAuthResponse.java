package com.influencehub.backend.fan.dto;

import java.time.LocalDateTime;
import java.util.List;

public class FanAuthResponse {

    private final String sessionToken;
    private final LocalDateTime expiresAt;
    private final String email;
    private final String nickname;
    private final List<FanRoomSummaryResponse> joinedRooms;

    public FanAuthResponse(
        String sessionToken,
        LocalDateTime expiresAt,
        String email,
        String nickname,
        List<FanRoomSummaryResponse> joinedRooms
    ) {
        this.sessionToken = sessionToken;
        this.expiresAt = expiresAt;
        this.email = email;
        this.nickname = nickname;
        this.joinedRooms = joinedRooms;
    }

    public String getSessionToken() {
        return sessionToken;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }

    public String getEmail() {
        return email;
    }

    public String getNickname() {
        return nickname;
    }

    public List<FanRoomSummaryResponse> getJoinedRooms() {
        return joinedRooms;
    }
}
