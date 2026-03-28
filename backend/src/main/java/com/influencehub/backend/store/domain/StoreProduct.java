package com.influencehub.backend.store.domain;

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
@Table(name = "store_products")
public class StoreProduct extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "room_id", nullable = false)
    private CreatorRoom room;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private StoreProductSourceType sourceType;

    @Column(nullable = false, length = 140)
    private String name;

    @Column(length = 500)
    private String description;

    @Column(length = 1000)
    private String imageUrl;

    @Column(length = 1000)
    private String externalUrl;

    @Column(length = 80)
    private String priceText;

    @Column(length = 80)
    private String statusLabel;

    @Column(length = 120)
    private String salesLabel;

    @Column(length = 120)
    private String sourceLabel;

    @Column(nullable = false)
    private boolean visible;

    protected StoreProduct() {
    }

    public StoreProduct(
        CreatorRoom room,
        StoreProductSourceType sourceType,
        String name,
        String description,
        String imageUrl,
        String externalUrl,
        String priceText,
        String statusLabel,
        String salesLabel,
        String sourceLabel
    ) {
        this.room = room;
        this.sourceType = sourceType;
        this.name = name;
        this.description = description;
        this.imageUrl = imageUrl;
        this.externalUrl = externalUrl;
        this.priceText = priceText;
        this.statusLabel = statusLabel;
        this.salesLabel = salesLabel;
        this.sourceLabel = sourceLabel;
        this.visible = true;
    }

    public Long getId() {
        return id;
    }

    public CreatorRoom getRoom() {
        return room;
    }

    public StoreProductSourceType getSourceType() {
        return sourceType;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public String getExternalUrl() {
        return externalUrl;
    }

    public String getPriceText() {
        return priceText;
    }

    public String getStatusLabel() {
        return statusLabel;
    }

    public String getSalesLabel() {
        return salesLabel;
    }

    public String getSourceLabel() {
        return sourceLabel;
    }

    public boolean isVisible() {
        return visible;
    }

    public void update(
        String name,
        String description,
        String imageUrl,
        String externalUrl,
        String priceText,
        String statusLabel,
        String salesLabel,
        String sourceLabel
    ) {
        this.name = name;
        this.description = description;
        this.imageUrl = imageUrl;
        this.externalUrl = externalUrl;
        this.priceText = priceText;
        this.statusLabel = statusLabel;
        this.salesLabel = salesLabel;
        this.sourceLabel = sourceLabel;
    }

    public void updateVisible(boolean visible) {
        this.visible = visible;
    }
}
