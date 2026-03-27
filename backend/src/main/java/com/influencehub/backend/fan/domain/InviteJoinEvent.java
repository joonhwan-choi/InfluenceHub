package com.influencehub.backend.fan.domain;

import com.influencehub.backend.common.BaseTimeEntity;
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
@Table(name = "invite_join_events")
public class InviteJoinEvent extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "invite_link_id", nullable = false)
    private InviteLink inviteLink;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "fan_id", nullable = false)
    private User fan;

    @Column(nullable = false)
    private boolean newlyJoined;

    protected InviteJoinEvent() {
    }

    public InviteJoinEvent(InviteLink inviteLink, User fan, boolean newlyJoined) {
        this.inviteLink = inviteLink;
        this.fan = fan;
        this.newlyJoined = newlyJoined;
    }

    public Long getId() {
        return id;
    }

    public InviteLink getInviteLink() {
        return inviteLink;
    }

    public User getFan() {
        return fan;
    }

    public boolean isNewlyJoined() {
        return newlyJoined;
    }
}
