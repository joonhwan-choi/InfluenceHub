package com.influencehub.backend.publish.api;

import com.influencehub.backend.publish.dto.PublishJobHistoryResponse;
import com.influencehub.backend.publish.service.PublishJobQueryService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/publish-jobs")
public class PublishJobController {

    private final PublishJobQueryService publishJobQueryService;

    public PublishJobController(PublishJobQueryService publishJobQueryService) {
        this.publishJobQueryService = publishJobQueryService;
    }

    @GetMapping("/recent")
    public List<PublishJobHistoryResponse> recent(@RequestHeader("Authorization") String authorizationHeader) {
        return publishJobQueryService.getRecentJobs(extractBearerToken(authorizationHeader));
    }

    private String extractBearerToken(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new IllegalArgumentException("유효한 Bearer 토큰이 필요합니다.");
        }
        return authorizationHeader.substring("Bearer ".length()).trim();
    }
}
