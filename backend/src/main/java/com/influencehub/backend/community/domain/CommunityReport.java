package com.influencehub.backend.community.domain;

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
import javax.persistence.UniqueConstraint;

@Entity
@Table(
    name = "community_reports",
    uniqueConstraints = @UniqueConstraint(columnNames = {"post_id", "fan_id"})
)
public class CommunityReport extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "post_id", nullable = false)
    private CommunityPost post;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "fan_id", nullable = false)
    private User fan;

    @Column(nullable = false, length = 500)
    private String reason;

    protected CommunityReport() {
    }

    public CommunityReport(CommunityPost post, User fan, String reason) {
        this.post = post;
        this.fan = fan;
        this.reason = reason;
    }

    public CommunityPost getPost() {
        return post;
    }

    public User getFan() {
        return fan;
    }
}
