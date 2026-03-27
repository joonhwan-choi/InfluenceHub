package com.influencehub.backend.feature.repository;

import com.influencehub.backend.feature.domain.RoomFeature;
import com.influencehub.backend.room.domain.CreatorRoom;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoomFeatureRepository extends JpaRepository<RoomFeature, Long> {

    List<RoomFeature> findByRoom(CreatorRoom room);
}
