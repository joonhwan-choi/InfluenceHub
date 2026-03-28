package com.influencehub.backend.event.api;

import com.influencehub.backend.event.dto.CreateEventRequest;
import com.influencehub.backend.event.dto.EventSummaryResponse;
import com.influencehub.backend.event.dto.UpdateEventRequest;
import com.influencehub.backend.event.service.EventBoardService;
import java.util.List;
import javax.validation.Valid;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
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

    @PostMapping("/mine")
    public EventSummaryResponse create(
        @RequestHeader("Authorization") String authorizationHeader,
        @Valid @RequestBody CreateEventRequest request
    ) {
        return eventBoardService.create(extractBearerToken(authorizationHeader), request);
    }

    @PatchMapping("/mine/{eventId}")
    public EventSummaryResponse update(
        @RequestHeader("Authorization") String authorizationHeader,
        @PathVariable Long eventId,
        @RequestBody UpdateEventRequest request
    ) {
        return eventBoardService.update(extractBearerToken(authorizationHeader), eventId, request);
    }

    @PatchMapping("/mine/{eventId}/visibility")
    public EventSummaryResponse updateVisibility(
        @RequestHeader("Authorization") String authorizationHeader,
        @PathVariable Long eventId,
        @RequestBody UpdateEventRequest request
    ) {
        boolean visible = request.getVisible() != null && request.getVisible();
        return eventBoardService.updateVisibility(extractBearerToken(authorizationHeader), eventId, visible);
    }

    @DeleteMapping("/mine/{eventId}")
    public void delete(
        @RequestHeader("Authorization") String authorizationHeader,
        @PathVariable Long eventId
    ) {
        eventBoardService.delete(extractBearerToken(authorizationHeader), eventId);
    }

    private String extractBearerToken(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new IllegalArgumentException("유효한 Bearer 토큰이 필요합니다.");
        }
        return authorizationHeader.substring("Bearer ".length()).trim();
    }
}
