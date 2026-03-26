package com.influencehub.backend.youtube.dto;

import javax.validation.constraints.NotBlank;

public class YoutubeOAuthExchangeRequest {

    @NotBlank
    private String code;

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }
}
