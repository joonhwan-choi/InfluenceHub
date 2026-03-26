package com.influencehub.backend.publish.domain;

import com.influencehub.backend.common.BaseTimeEntity;
import com.influencehub.backend.room.domain.CreatorRoom;
import java.time.LocalDateTime;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "publish_jobs")
public class PublishJob extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "room_id", nullable = false)
    private CreatorRoom room;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PlatformType platformType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PublishStatus status;

    @Column(nullable = false, length = 140)
    private String title;

    @Column(length = 500)
    private String targetUrl;

    @Column(nullable = false)
    private LocalDateTime scheduledAt;

    protected PublishJob() {
    }

    public PublishJob(CreatorRoom room, PlatformType platformType, PublishStatus status, String title, LocalDateTime scheduledAt) {
        this.room = room;
        this.platformType = platformType;
        this.status = status;
        this.title = title;
        this.scheduledAt = scheduledAt;
    }

    public Long getId() {
        return id;
    }

    public CreatorRoom getRoom() {
        return room;
    }

    public PlatformType getPlatformType() {
        return platformType;
    }

    public PublishStatus getStatus() {
        return status;
    }

    public String getTitle() {
        return title;
    }

    public String getTargetUrl() {
        return targetUrl;
    }

    public LocalDateTime getScheduledAt() {
        return scheduledAt;
    }
}
