package com.influencehub.backend.publish.service;

import com.influencehub.backend.auth.domain.CreatorSession;
import com.influencehub.backend.auth.service.CreatorAuthService;
import com.influencehub.backend.publish.domain.PlatformType;
import com.influencehub.backend.publish.domain.PublishJob;
import com.influencehub.backend.publish.domain.PublishStatus;
import com.influencehub.backend.publish.dto.CreatePublishJobRequest;
import com.influencehub.backend.publish.dto.PublishJobHistoryResponse;
import com.influencehub.backend.publish.repository.PublishJobRepository;
import java.time.LocalDateTime;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PublishJobCommandService {

    private final CreatorAuthService creatorAuthService;
    private final PublishJobRepository publishJobRepository;

    public PublishJobCommandService(
        CreatorAuthService creatorAuthService,
        PublishJobRepository publishJobRepository
    ) {
        this.creatorAuthService = creatorAuthService;
        this.publishJobRepository = publishJobRepository;
    }

    @Transactional
    public PublishJobHistoryResponse schedule(String sessionToken, CreatePublishJobRequest request) {
        CreatorSession session = creatorAuthService.requireSession(sessionToken);
        LocalDateTime scheduledAt = parseScheduledAt(request.getScheduledAt());
        String title = request.getTitle() == null || request.getTitle().isBlank()
            ? "예약 업로드"
            : request.getTitle().trim();

        PublishJob publishJob = publishJobRepository.save(
            new PublishJob(
                session.getRoom(),
                PlatformType.YOUTUBE,
                PublishStatus.READY,
                title,
                scheduledAt
            )
        );

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

    private LocalDateTime parseScheduledAt(String scheduledAt) {
        if (scheduledAt == null || scheduledAt.isBlank()) {
            return LocalDateTime.now().plusHours(2);
        }
        return LocalDateTime.parse(scheduledAt);
    }
}
