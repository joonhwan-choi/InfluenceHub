package com.influencehub.backend.store.dto;

import javax.validation.constraints.NotBlank;

public class StoreImportPreviewRequest {

    @NotBlank
    private String sourceUrl;

    public String getSourceUrl() {
        return sourceUrl;
    }
}
