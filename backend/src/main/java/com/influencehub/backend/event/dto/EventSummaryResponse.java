package com.influencehub.backend.event.dto;

public class EventSummaryResponse {

    private final Long eventId;
    private final String title;
    private final String detail;
    private final String scheduleLabel;
    private final boolean visible;

    public EventSummaryResponse(Long eventId, String title, String detail, String scheduleLabel, boolean visible) {
        this.eventId = eventId;
        this.title = title;
        this.detail = detail;
        this.scheduleLabel = scheduleLabel;
        this.visible = visible;
    }

    public Long getEventId() {
        return eventId;
    }

    public String getTitle() {
        return title;
    }

    public String getDetail() {
        return detail;
    }

    public String getScheduleLabel() {
        return scheduleLabel;
    }

    public boolean isVisible() {
        return visible;
    }
}
