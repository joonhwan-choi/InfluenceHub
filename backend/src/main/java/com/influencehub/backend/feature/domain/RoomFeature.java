package com.influencehub.backend.feature.domain;

import com.influencehub.backend.common.BaseTimeEntity;
import com.influencehub.backend.room.domain.CreatorRoom;
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
@Table(name = "room_features")
public class RoomFeature extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "room_id", nullable = false)
    private CreatorRoom room;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private RoomFeatureType featureType;

    @Column(nullable = false)
    private boolean enabled;

    protected RoomFeature() {
    }

    public RoomFeature(CreatorRoom room, RoomFeatureType featureType, boolean enabled) {
        this.room = room;
        this.featureType = featureType;
        this.enabled = enabled;
    }

    public Long getId() {
        return id;
    }

    public CreatorRoom getRoom() {
        return room;
    }

    public RoomFeatureType getFeatureType() {
        return featureType;
    }

    public boolean isEnabled() {
        return enabled;
    }
}
