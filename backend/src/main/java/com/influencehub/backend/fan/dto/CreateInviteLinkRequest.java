package com.influencehub.backend.fan.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import javax.validation.constraints.NotBlank;

public class CreateInviteLinkRequest {

    @NotBlank
    @JsonProperty("title")
    private String title;

    @NotBlank
    @JsonProperty("sourceLabel")
    private String sourceLabel;

    public String getTitle() {
        return title;
    }

    public String getSourceLabel() {
        return sourceLabel;
    }
}
