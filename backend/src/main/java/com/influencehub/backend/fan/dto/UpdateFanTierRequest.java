package com.influencehub.backend.fan.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import javax.validation.constraints.NotBlank;

public class UpdateFanTierRequest {

    @NotBlank
    @JsonProperty("tier")
    private String tier;

    public String getTier() {
        return tier;
    }
}
