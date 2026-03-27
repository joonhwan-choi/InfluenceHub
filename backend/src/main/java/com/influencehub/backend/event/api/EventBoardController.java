package com.influencehub.backend.event.api;

import com.influencehub.backend.event.dto.EventSummaryResponse;
import com.influencehub.backend.event.service.EventBoardService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/events")
public class EventBoardController {

    private final EventBoardService eventBoardService;

    public EventBoardController(EventBoardService eventBoardService) {
        this.eventBoardService = eventBoardService;
    }

    @GetMapping("/mine")
    public List<EventSummaryResponse> mine(@RequestHeader("Authorization") String authorizationHeader) {
        return eventBoardService.getMine(extractBearerToken(authorizationHeader));
    }

    private String extractBearerToken(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new IllegalArgumentException("유효한 Bearer 토큰이 필요합니다.");
        }
        return authorizationHeader.substring("Bearer ".length()).trim();
    }
}
