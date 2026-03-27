package com.influencehub.backend.publish.repository;

import com.influencehub.backend.publish.domain.PublishJob;
import com.influencehub.backend.room.domain.CreatorRoom;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PublishJobRepository extends JpaRepository<PublishJob, Long> {

    List<PublishJob> findTop10ByRoomOrderByCreatedAtDesc(CreatorRoom room);
}
