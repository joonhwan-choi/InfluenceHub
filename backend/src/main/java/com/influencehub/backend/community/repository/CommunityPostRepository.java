package com.influencehub.backend.community.repository;

import com.influencehub.backend.community.domain.CommunityPost;
import com.influencehub.backend.room.domain.CreatorRoom;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommunityPostRepository extends JpaRepository<CommunityPost, Long> {

    List<CommunityPost> findTop20ByRoomOrderByCreatedAtDesc(CreatorRoom room);

    java.util.Optional<CommunityPost> findByIdAndRoom(Long id, CreatorRoom room);

    List<CommunityPost> findTop20ByRoomOrderByCreatedAtDescIdDesc(CreatorRoom room);
}
