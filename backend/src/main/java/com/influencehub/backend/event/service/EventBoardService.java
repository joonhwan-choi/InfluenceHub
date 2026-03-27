package com.influencehub.backend.event.service;

import com.influencehub.backend.auth.domain.CreatorSession;
import com.influencehub.backend.auth.service.CreatorAuthService;
import com.influencehub.backend.event.dto.EventSummaryResponse;
import java.util.Arrays;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EventBoardService {

    private final CreatorAuthService creatorAuthService;

    public EventBoardService(CreatorAuthService creatorAuthService) {
        this.creatorAuthService = creatorAuthService;
    }

    @Transactional(readOnly = true)
    public List<EventSummaryResponse> getMine(String sessionToken) {
        CreatorSession session = creatorAuthService.requireSession(sessionToken);
        String roomName = session.getRoom().getRoomName();
        return Arrays.asList(
            new EventSummaryResponse("참여 공지 오픈", roomName + " 팬방 상단과 푸시에 동시에 노출됩니다."),
            new EventSummaryResponse("미션 인증 수집", "댓글, 이미지, 해시태그 인증을 조건별로 자동 분류합니다."),
            new EventSummaryResponse("추첨 및 발표", "당첨 카드와 DM 문구까지 바로 이어서 정리합니다.")
        );
    }
}
