package com.influencehub.backend.fan.dto;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

public class FanJoinInviteRequest {

    @NotBlank
    private String inviteCode;

    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String nickname;

    public String getInviteCode() {
        return inviteCode;
    }

    public String getEmail() {
        return email;
    }

    public String getNickname() {
        return nickname;
    }
}
