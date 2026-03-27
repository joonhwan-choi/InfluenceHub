package com.influencehub.backend.fan.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

public class FanJoinInviteRequest {

    @NotBlank
    @JsonProperty("inviteCode")
    private String inviteCode;

    @Email
    @NotBlank
    @JsonProperty("email")
    private String email;

    @NotBlank
    @JsonProperty("nickname")
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
