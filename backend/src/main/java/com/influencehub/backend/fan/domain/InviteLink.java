package com.influencehub.backend.fan.domain;

import com.influencehub.backend.common.BaseTimeEntity;
import com.influencehub.backend.room.domain.CreatorRoom;
import com.influencehub.backend.user.domain.User;
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
@Table(name = "invite_links")
public class InviteLink extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "room_id", nullable = false)
    private CreatorRoom room;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "creator_id", nullable = false)
    private User creator;

    @Column(nullable = false, unique = true, length = 80)
    private String inviteCode;

    @Column(nullable = false, length = 120)
    private String title;

    @Column(nullable = false, length = 40)
    private String sourceLabel;

    @Column(nullable = false)
    private long openCount;

    @Column(nullable = false)
    private long joinCount;

    protected InviteLink() {
    }

    public InviteLink(CreatorRoom room, User creator, String inviteCode, String title, String sourceLabel) {
        this.room = room;
        this.creator = creator;
        this.inviteCode = inviteCode;
        this.title = title;
        this.sourceLabel = sourceLabel;
        this.openCount = 0L;
        this.joinCount = 0L;
    }

    public Long getId() {
        return id;
    }

    public CreatorRoom getRoom() {
        return room;
    }

    public User getCreator() {
        return creator;
    }

    public String getInviteCode() {
        return inviteCode;
    }

    public String getTitle() {
        return title;
    }

    public String getSourceLabel() {
        return sourceLabel;
    }

    public long getOpenCount() {
        return openCount;
    }

    public long getJoinCount() {
        return joinCount;
    }

    public void recordOpen() {
        this.openCount += 1L;
    }

    public void recordJoin() {
        this.joinCount += 1L;
    }
}
