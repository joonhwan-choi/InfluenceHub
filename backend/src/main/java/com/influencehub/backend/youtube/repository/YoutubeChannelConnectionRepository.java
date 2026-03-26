package com.influencehub.backend.youtube.repository;

import com.influencehub.backend.youtube.domain.YoutubeChannelConnection;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface YoutubeChannelConnectionRepository extends JpaRepository<YoutubeChannelConnection, Long> {

    Optional<YoutubeChannelConnection> findByYoutubeChannelId(String youtubeChannelId);

    Optional<YoutubeChannelConnection> findTopByOrderByCreatedAtDesc();
}
