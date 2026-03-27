package com.influencehub.backend.fan.dto;

public class InviteLinkResponse {

    private final Long inviteLinkId;
    private final String inviteCode;
    private final String title;
    private final String sourceLabel;
    private final long openCount;
    private final long joinCount;
    private final String inviteUrl;

    public InviteLinkResponse(
        Long inviteLinkId,
        String inviteCode,
        String title,
        String sourceLabel,
        long openCount,
        long joinCount,
        String inviteUrl
    ) {
        this.inviteLinkId = inviteLinkId;
        this.inviteCode = inviteCode;
        this.title = title;
        this.sourceLabel = sourceLabel;
        this.openCount = openCount;
        this.joinCount = joinCount;
        this.inviteUrl = inviteUrl;
    }

    public Long getInviteLinkId() {
        return inviteLinkId;
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

    public long getOpenCount() {
        return openCount;
    }

    public long getJoinCount() {
        return joinCount;
    }

    public String getInviteUrl() {
        return inviteUrl;
    }
}
