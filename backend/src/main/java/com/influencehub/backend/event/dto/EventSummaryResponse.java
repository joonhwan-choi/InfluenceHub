package com.influencehub.backend.event.dto;

public class EventSummaryResponse {

    private final String title;
    private final String detail;

    public EventSummaryResponse(String title, String detail) {
        this.title = title;
        this.detail = detail;
    }

    public String getTitle() {
        return title;
    }

    public String getDetail() {
        return detail;
    }
}
