package com.influencehub.backend.fan.dto;

public class InviteLinkDetailResponse {

    private final String inviteCode;
    private final String title;
    private final String sourceLabel;
    private final String roomName;
    private final String roomSlug;
    private final String creatorName;
    private final String roomDescription;

    public InviteLinkDetailResponse(
        String inviteCode,
        String title,
        String sourceLabel,
        String roomName,
        String roomSlug,
        String creatorName,
        String roomDescription
    ) {
        this.inviteCode = inviteCode;
        this.title = title;
        this.sourceLabel = sourceLabel;
        this.roomName = roomName;
        this.roomSlug = roomSlug;
        this.creatorName = creatorName;
        this.roomDescription = roomDescription;
    }

    public String getInviteCode() {
        return inviteCode;
    }

    public String getTitle() {
        return title;
    }

    public String getSourceLabel() {
        return sourceLabel;
    }

    public String getRoomName() {
        return roomName;
    }

    public String getRoomSlug() {
        return roomSlug;
    }

    public String getCreatorName() {
        return creatorName;
    }

    public String getRoomDescription() {
        return roomDescription;
    }
}
