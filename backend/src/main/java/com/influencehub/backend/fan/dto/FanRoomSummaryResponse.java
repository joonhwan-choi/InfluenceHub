package com.influencehub.backend.fan.dto;

public class FanRoomSummaryResponse {

    private final Long membershipId;
    private final String creatorName;
    private final String roomName;
    private final String roomSlug;
    private final String joinedVia;

    public FanRoomSummaryResponse(
        Long membershipId,
        String creatorName,
        String roomName,
        String roomSlug,
        String joinedVia
    ) {
        this.membershipId = membershipId;
        this.creatorName = creatorName;
        this.roomName = roomName;
        this.roomSlug = roomSlug;
        this.joinedVia = joinedVia;
    }

    public Long getMembershipId() {
        return membershipId;
    }

    public String getCreatorName() {
        return creatorName;
    }

    public String getRoomName() {
        return roomName;
    }

    public String getRoomSlug() {
        return roomSlug;
    }

    public String getJoinedVia() {
        return joinedVia;
    }
}
