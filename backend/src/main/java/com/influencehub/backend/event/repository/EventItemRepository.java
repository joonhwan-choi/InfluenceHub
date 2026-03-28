package com.influencehub.backend.event.repository;

import com.influencehub.backend.event.domain.EventItem;
import com.influencehub.backend.room.domain.CreatorRoom;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventItemRepository extends JpaRepository<EventItem, Long> {

    List<EventItem> findTop20ByRoomOrderByCreatedAtDesc(CreatorRoom room);

    Optional<EventItem> findByIdAndRoom(Long id, CreatorRoom room);
}
