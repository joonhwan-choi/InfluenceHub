package com.influencehub.backend.room.repository;

import com.influencehub.backend.room.domain.CreatorRoom;
import com.influencehub.backend.user.domain.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CreatorRoomRepository extends JpaRepository<CreatorRoom, Long> {

    Optional<CreatorRoom> findByOwner(User owner);

    boolean existsBySlug(String slug);
}
