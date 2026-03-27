package com.influencehub.backend.publish.api;

import com.influencehub.backend.publish.dto.CreatePublishJobRequest;
import com.influencehub.backend.publish.dto.PublishJobHistoryResponse;
import com.influencehub.backend.publish.service.PublishJobCommandService;
import com.influencehub.backend.publish.service.PublishJobQueryService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/publish-jobs")
public class PublishJobController {

    private final PublishJobQueryService publishJobQueryService;
    private final PublishJobCommandService publishJobCommandService;

    public PublishJobController(
        PublishJobQueryService publishJobQueryService,
        PublishJobCommandService publishJobCommandService
    ) {
        this.publishJobQueryService = publishJobQueryService;
        this.publishJobCommandService = publishJobCommandService;
    }

    @GetMapping("/recent")
    public List<PublishJobHistoryResponse> recent(@RequestHeader("Authorization") String authorizationHeader) {
        return publishJobQueryService.getRecentJobs(extractBearerToken(authorizationHeader));
    }

    @PostMapping("/schedule")
    public PublishJobHistoryResponse schedule(
        @RequestHeader("Authorization") String authorizationHeader,
        @RequestBody CreatePublishJobRequest request
    ) {
        return publishJobCommandService.schedule(extractBearerToken(authorizationHeader), request);
    }

    private String extractBearerToken(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new IllegalArgumentException("유효한 Bearer 토큰이 필요합니다.");
        }
        return authorizationHeader.substring("Bearer ".length()).trim();
    }
}
