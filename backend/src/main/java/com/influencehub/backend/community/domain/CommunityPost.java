package com.influencehub.backend.community.domain;

import com.influencehub.backend.common.BaseTimeEntity;
import com.influencehub.backend.room.domain.CreatorRoom;
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
@Table(name = "community_posts")
public class CommunityPost extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "room_id", nullable = false)
    private CreatorRoom room;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "author_id", nullable = false)
    private User author;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PostType postType;

    @Column(nullable = false, length = 140)
    private String title;

    @Column(nullable = false, length = 3000)
    private String content;

    @Column(name = "image_url", columnDefinition = "TEXT")
    private String imageUrl;

    protected CommunityPost() {
    }

    public CommunityPost(CreatorRoom room, User author, PostType postType, String title, String content) {
        this(room, author, postType, title, content, null);
    }

    public CommunityPost(CreatorRoom room, User author, PostType postType, String title, String content, String imageUrl) {
        this.room = room;
        this.author = author;
        this.postType = postType;
        this.title = title;
        this.content = content;
        this.imageUrl = imageUrl;
    }

    public Long getId() {
        return id;
    }

    public CreatorRoom getRoom() {
        return room;
    }

    public User getAuthor() {
        return author;
    }

    public PostType getPostType() {
        return postType;
    }

    public String getTitle() {
        return title;
    }

    public String getContent() {
        return content;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void update(String title, String content, String imageUrl) {
        this.title = title;
        this.content = content;
        this.imageUrl = imageUrl;
    }
}
