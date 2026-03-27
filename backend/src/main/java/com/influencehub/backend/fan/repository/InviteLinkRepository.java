package com.influencehub.backend.fan.repository;

import com.influencehub.backend.fan.domain.InviteLink;
import com.influencehub.backend.room.domain.CreatorRoom;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InviteLinkRepository extends JpaRepository<InviteLink, Long> {

    Optional<InviteLink> findByInviteCode(String inviteCode);

    List<InviteLink> findByRoomOrderByCreatedAtDesc(CreatorRoom room);
}
