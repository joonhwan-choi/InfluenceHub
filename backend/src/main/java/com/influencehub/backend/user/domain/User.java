package com.influencehub.backend.user.domain;

import com.influencehub.backend.common.BaseTimeEntity;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "users")
public class User extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 60)
    private String email;

    @Column(nullable = false, length = 40)
    private String nickname;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private UserRole role;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AuthProvider authProvider;

    @Column(length = 120)
    private String profileImageUrl;

    protected User() {
    }

    public User(String email, String nickname, UserRole role, AuthProvider authProvider) {
        this.email = email;
        this.nickname = nickname;
        this.role = role;
        this.authProvider = authProvider;
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getNickname() {
        return nickname;
    }

    public UserRole getRole() {
        return role;
    }

    public AuthProvider getAuthProvider() {
        return authProvider;
    }

    public String getProfileImageUrl() {
        return profileImageUrl;
    }
}
