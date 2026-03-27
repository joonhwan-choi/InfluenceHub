package com.influencehub.backend.fan.dto;

public class CreatorFanMemberResponse {

    private final Long membershipId;
    private final String fanEmail;
    private final String fanNickname;
    private final String joinedVia;
    private final String tier;

    public CreatorFanMemberResponse(
        Long membershipId,
        String fanEmail,
        String fanNickname,
        String joinedVia,
        String tier
    ) {
        this.membershipId = membershipId;
        this.fanEmail = fanEmail;
        this.fanNickname = fanNickname;
        this.joinedVia = joinedVia;
        this.tier = tier;
    }

    public Long getMembershipId() {
        return membershipId;
    }

    public String getFanEmail() {
        return fanEmail;
    }

    public String getFanNickname() {
        return fanNickname;
    }

    public String getJoinedVia() {
        return joinedVia;
    }

    public String getTier() {
        return tier;
    }
}
