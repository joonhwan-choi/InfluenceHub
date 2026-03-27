package com.influencehub.backend.fan.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

public class FanLoginRequest {

    @NotBlank
    @Email
    @JsonProperty("email")
    private String email;

    @JsonProperty("nickname")
    private String nickname;

    public String getEmail() {
        return email;
    }

    public String getNickname() {
        return nickname;
    }
}
