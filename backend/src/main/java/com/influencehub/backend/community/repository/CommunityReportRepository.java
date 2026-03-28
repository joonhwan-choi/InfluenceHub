package com.influencehub.backend.community.repository;

import com.influencehub.backend.community.domain.CommunityPost;
import com.influencehub.backend.community.domain.CommunityReport;
import com.influencehub.backend.user.domain.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommunityReportRepository extends JpaRepository<CommunityReport, Long> {

    Optional<CommunityReport> findByPostAndFan(CommunityPost post, User fan);

    long countByPost(CommunityPost post);

    List<CommunityReport> findByPostIn(List<CommunityPost> posts);
}
