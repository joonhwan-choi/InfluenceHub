package com.influencehub.backend.fan.repository;

import com.influencehub.backend.fan.domain.FanMembership;
import com.influencehub.backend.room.domain.CreatorRoom;
import com.influencehub.backend.user.domain.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FanMembershipRepository extends JpaRepository<FanMembership, Long> {

    Optional<FanMembership> findByFanAndRoom(User fan, CreatorRoom room);

    List<FanMembership> findByFanOrderByCreatedAtDesc(User fan);

    List<FanMembership> findByRoomOrderByCreatedAtDesc(CreatorRoom room);
}
