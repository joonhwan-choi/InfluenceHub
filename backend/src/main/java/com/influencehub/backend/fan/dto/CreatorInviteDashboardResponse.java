package com.influencehub.backend.fan.dto;

import java.util.List;

public class CreatorInviteDashboardResponse {

    private final long totalOpenCount;
    private final long totalJoinCount;
    private final long multiRoomFanCount;
    private final List<InviteLinkResponse> inviteLinks;

    public CreatorInviteDashboardResponse(
        long totalOpenCount,
        long totalJoinCount,
        long multiRoomFanCount,
        List<InviteLinkResponse> inviteLinks
    ) {
        this.totalOpenCount = totalOpenCount;
        this.totalJoinCount = totalJoinCount;
        this.multiRoomFanCount = multiRoomFanCount;
        this.inviteLinks = inviteLinks;
    }

    public long getTotalOpenCount() {
        return totalOpenCount;
    }

    public long getTotalJoinCount() {
        return totalJoinCount;
    }

    public long getMultiRoomFanCount() {
        return multiRoomFanCount;
    }

    public List<InviteLinkResponse> getInviteLinks() {
        return inviteLinks;
    }
}
