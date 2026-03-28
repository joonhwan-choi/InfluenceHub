package com.influencehub.backend.event.dto;

import javax.validation.constraints.NotBlank;

public class CreateEventRequest {

    @NotBlank
    private String title;

    @NotBlank
    private String detail;

    @NotBlank
    private String scheduleLabel;

    private Boolean visible;

    public String getTitle() {
        return title;
    }

    public String getDetail() {
        return detail;
    }

    public String getScheduleLabel() {
        return scheduleLabel;
    }

    public Boolean getVisible() {
        return visible;
    }
}
