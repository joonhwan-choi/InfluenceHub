package com.influencehub.backend.fan.dto;

import javax.validation.constraints.NotBlank;

public class CreateInviteLinkRequest {

    @NotBlank
    private String title;

    @NotBlank
    private String sourceLabel;

    public String getTitle() {
        return title;
    }

    public String getSourceLabel() {
        return sourceLabel;
    }
}
