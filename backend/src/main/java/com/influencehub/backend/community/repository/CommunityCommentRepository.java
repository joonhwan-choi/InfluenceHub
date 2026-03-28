package com.influencehub.backend.community.repository;

import com.influencehub.backend.community.domain.CommunityComment;
import com.influencehub.backend.community.domain.CommunityPost;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommunityCommentRepository extends JpaRepository<CommunityComment, Long> {

    List<CommunityComment> findByPostOrderByCreatedAtAsc(CommunityPost post);

    long countByPost(CommunityPost post);
}
