package com.influencehub.backend.room.domain;

import com.influencehub.backend.common.BaseTimeEntity;
import com.influencehub.backend.user.domain.User;
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
@Table(name = "creator_rooms")
public class CreatorRoom extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @Column(nullable = false, length = 80)
    private String roomName;

    @Column(nullable = false, unique = true, length = 80)
    private String slug;

    @Column(nullable = false, length = 400)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private RoomVisibility visibility;

    protected CreatorRoom() {
    }

    public CreatorRoom(User owner, String roomName, String slug, String description, RoomVisibility visibility) {
        this.owner = owner;
        this.roomName = roomName;
        this.slug = slug;
        this.description = description;
        this.visibility = visibility;
    }

    public Long getId() {
        return id;
    }

    public User getOwner() {
        return owner;
    }

    public String getRoomName() {
        return roomName;
    }

    public String getSlug() {
        return slug;
    }

    public String getDescription() {
        return description;
    }

    public RoomVisibility getVisibility() {
        return visibility;
    }
}
