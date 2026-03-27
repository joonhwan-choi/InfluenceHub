package com.influencehub.backend.publish.service;

import com.influencehub.backend.auth.domain.CreatorSession;
import com.influencehub.backend.auth.service.CreatorAuthService;
import com.influencehub.backend.publish.domain.PublishJob;
import com.influencehub.backend.publish.dto.PublishJobHistoryResponse;
import com.influencehub.backend.publish.repository.PublishJobRepository;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PublishJobQueryService {

    private final CreatorAuthService creatorAuthService;
    private final PublishJobRepository publishJobRepository;

    public PublishJobQueryService(
        CreatorAuthService creatorAuthService,
        PublishJobRepository publishJobRepository
    ) {
        this.creatorAuthService = creatorAuthService;
        this.publishJobRepository = publishJobRepository;
    }

    @Transactional(readOnly = true)
    public List<PublishJobHistoryResponse> getRecentJobs(String sessionToken) {
        CreatorSession session = creatorAuthService.requireSession(sessionToken);
        return publishJobRepository.findTop10ByRoomOrderByCreatedAtDesc(session.getRoom()).stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    private PublishJobHistoryResponse toResponse(PublishJob publishJob) {
        return new PublishJobHistoryResponse(
            publishJob.getId(),
            publishJob.getPlatformType().name(),
            publishJob.getStatus().name(),
            publishJob.getTitle(),
            publishJob.getTargetUrl(),
            publishJob.getScheduledAt(),
            publishJob.getCreatedAt()
        );
    }
}
