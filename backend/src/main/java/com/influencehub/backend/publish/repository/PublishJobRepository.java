package com.influencehub.backend.publish.repository;

import com.influencehub.backend.publish.domain.PublishJob;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PublishJobRepository extends JpaRepository<PublishJob, Long> {
}
