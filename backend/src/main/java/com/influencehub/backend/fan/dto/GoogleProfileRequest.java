package com.influencehub.backend.fan.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

public class GoogleProfileRequest {

    @NotBlank
    @Email
    @JsonProperty("email")
    private String email;

    @NotBlank
    @JsonProperty("name")
    private String name;

    @JsonProperty("picture")
    private String picture;

    public GoogleUserProfile toProfile() {
        return new GoogleUserProfile(email, name, picture);
    }
}
