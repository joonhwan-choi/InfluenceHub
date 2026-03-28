package com.influencehub.backend.event.domain;

import com.influencehub.backend.common.BaseTimeEntity;
import com.influencehub.backend.room.domain.CreatorRoom;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "event_items")
public class EventItem extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "room_id", nullable = false)
    private CreatorRoom room;

    @Column(nullable = false, length = 120)
    private String title;

    @Column(nullable = false, length = 500)
    private String detail;

    @Column(nullable = false, length = 40)
    private String scheduleLabel;

    @Column(nullable = false)
    private boolean visible;

    protected EventItem() {
    }

    public EventItem(CreatorRoom room, String title, String detail, String scheduleLabel) {
        this.room = room;
        this.title = title;
        this.detail = detail;
        this.scheduleLabel = scheduleLabel;
        this.visible = true;
    }

    public Long getId() {
        return id;
    }

    public CreatorRoom getRoom() {
        return room;
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

    public void update(String title, String detail, String scheduleLabel) {
        this.title = title;
        this.detail = detail;
        this.scheduleLabel = scheduleLabel;
    }

    public void updateVisible(boolean visible) {
        this.visible = visible;
    }
}
