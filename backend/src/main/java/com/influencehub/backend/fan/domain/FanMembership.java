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
@Table(name = "fan_memberships")
public class FanMembership extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "fan_id", nullable = false)
    private User fan;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "room_id", nullable = false)
    private CreatorRoom room;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "invite_link_id", nullable = false)
    private InviteLink inviteLink;

    @Column(nullable = false, length = 80)
    private String joinedVia;

    protected FanMembership() {
    }

    public FanMembership(User fan, CreatorRoom room, InviteLink inviteLink, String joinedVia) {
        this.fan = fan;
        this.room = room;
        this.inviteLink = inviteLink;
        this.joinedVia = joinedVia;
    }

    public Long getId() {
        return id;
    }

    public User getFan() {
        return fan;
    }

    public CreatorRoom getRoom() {
        return room;
    }

    public InviteLink getInviteLink() {
        return inviteLink;
    }

    public String getJoinedVia() {
        return joinedVia;
    }
}
