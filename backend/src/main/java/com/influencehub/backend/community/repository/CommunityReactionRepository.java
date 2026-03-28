package com.influencehub.backend.community.repository;

import com.influencehub.backend.community.domain.CommunityPost;
import com.influencehub.backend.community.domain.CommunityReaction;
import com.influencehub.backend.user.domain.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommunityReactionRepository extends JpaRepository<CommunityReaction, Long> {

    Optional<CommunityReaction> findByPostAndFan(CommunityPost post, User fan);

    long countByPost(CommunityPost post);

    List<CommunityReaction> findByPostIn(List<CommunityPost> posts);
}
