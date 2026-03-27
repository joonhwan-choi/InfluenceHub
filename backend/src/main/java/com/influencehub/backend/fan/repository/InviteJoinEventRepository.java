package com.influencehub.backend.fan.repository;

import com.influencehub.backend.fan.domain.InviteJoinEvent;
import com.influencehub.backend.fan.domain.InviteLink;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InviteJoinEventRepository extends JpaRepository<InviteJoinEvent, Long> {

    List<InviteJoinEvent> findByInviteLinkOrderByCreatedAtDesc(InviteLink inviteLink);
}
