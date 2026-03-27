package com.influencehub.backend.fan.dto;

public class FanRoomSummaryResponse {

    private final Long membershipId;
    private final String creatorName;
    private final String roomName;
    private final String roomSlug;
    private final String joinedVia;
    private final String tier;

    public FanRoomSummaryResponse(
        Long membershipId,
        String creatorName,
        String roomName,
        String roomSlug,
        String joinedVia,
        String tier
    ) {
        this.membershipId = membershipId;
        this.creatorName = creatorName;
        this.roomName = roomName;
        this.roomSlug = roomSlug;
        this.joinedVia = joinedVia;
        this.tier = tier;
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

    public String getTier() {
        return tier;
    }
}
