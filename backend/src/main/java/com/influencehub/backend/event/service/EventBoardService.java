package com.influencehub.backend.event.service;

import com.influencehub.backend.auth.domain.CreatorSession;
import com.influencehub.backend.auth.service.CreatorAuthService;
import com.influencehub.backend.event.domain.EventItem;
import com.influencehub.backend.event.dto.CreateEventRequest;
import com.influencehub.backend.event.dto.EventSummaryResponse;
import com.influencehub.backend.event.dto.UpdateEventRequest;
import com.influencehub.backend.event.repository.EventItemRepository;
import com.influencehub.backend.room.domain.CreatorRoom;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EventBoardService {

    private final CreatorAuthService creatorAuthService;
    private final EventItemRepository eventItemRepository;

    public EventBoardService(
        CreatorAuthService creatorAuthService,
        EventItemRepository eventItemRepository
    ) {
        this.creatorAuthService = creatorAuthService;
        this.eventItemRepository = eventItemRepository;
    }

    @Transactional(readOnly = true)
    public List<EventSummaryResponse> getMine(String sessionToken) {
        CreatorSession session = creatorAuthService.requireSession(sessionToken);
        return getOrSeedEvents(session.getRoom());
    }

    @Transactional
    public EventSummaryResponse create(String sessionToken, CreateEventRequest request) {
        CreatorSession session = creatorAuthService.requireSession(sessionToken);
        CreatorRoom room = session.getRoom();
        EventItem eventItem = eventItemRepository.save(
            new EventItem(
                room,
                request.getTitle().trim(),
                request.getDetail().trim(),
                request.getScheduleLabel().trim()
            )
        );
        if (request.getVisible() != null) {
            eventItem.updateVisible(request.getVisible());
        }
        return toResponse(eventItem);
    }

    @Transactional
    public EventSummaryResponse update(String sessionToken, Long eventId, UpdateEventRequest request) {
        CreatorSession session = creatorAuthService.requireSession(sessionToken);
        CreatorRoom room = session.getRoom();
        EventItem eventItem = eventItemRepository.findByIdAndRoom(eventId, room)
            .orElseThrow(() -> new IllegalStateException("이벤트를 찾지 못했습니다."));
        eventItem.update(
            request.getTitle().trim(),
            request.getDetail().trim(),
            request.getScheduleLabel().trim()
        );
        if (request.getVisible() != null) {
            eventItem.updateVisible(request.getVisible());
        }
        return toResponse(eventItem);
    }

    @Transactional
    public EventSummaryResponse updateVisibility(String sessionToken, Long eventId, boolean visible) {
        CreatorSession session = creatorAuthService.requireSession(sessionToken);
        CreatorRoom room = session.getRoom();
        EventItem eventItem = eventItemRepository.findByIdAndRoom(eventId, room)
            .orElseThrow(() -> new IllegalStateException("이벤트를 찾지 못했습니다."));
        eventItem.updateVisible(visible);
        return toResponse(eventItem);
    }

    @Transactional
    public void delete(String sessionToken, Long eventId) {
        CreatorSession session = creatorAuthService.requireSession(sessionToken);
        CreatorRoom room = session.getRoom();
        EventItem eventItem = eventItemRepository.findByIdAndRoom(eventId, room)
            .orElseThrow(() -> new IllegalStateException("이벤트를 찾지 못했습니다."));
        eventItemRepository.delete(eventItem);
    }

    private List<EventSummaryResponse> getOrSeedEvents(CreatorRoom room) {
        List<EventItem> items = eventItemRepository.findTop20ByRoomOrderByCreatedAtDesc(room);
        if (items.isEmpty()) {
            items = eventItemRepository.saveAll(
                java.util.Arrays.asList(
                    new EventItem(room, "참여 공지 오픈", room.getRoomName() + " 팬방 상단과 푸시에 동시에 노출됩니다.", "오늘"),
                    new EventItem(room, "미션 인증 수집", "댓글, 이미지, 해시태그 인증을 조건별로 자동 분류합니다.", "내일"),
                    new EventItem(room, "추첨 및 발표", "당첨 카드와 DM 문구까지 바로 이어서 정리합니다.", "이번 주")
                )
            );
        }
        return items.stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    private EventSummaryResponse toResponse(EventItem item) {
        return new EventSummaryResponse(
            item.getId(),
            item.getTitle(),
            item.getDetail(),
            item.getScheduleLabel(),
            item.isVisible()
        );
    }
}
