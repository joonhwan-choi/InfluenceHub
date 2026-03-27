package com.influencehub.backend.store.service;

import com.influencehub.backend.auth.domain.CreatorSession;
import com.influencehub.backend.auth.service.CreatorAuthService;
import com.influencehub.backend.store.dto.StoreItemResponse;
import java.util.Arrays;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class StoreBoardService {

    private final CreatorAuthService creatorAuthService;

    public StoreBoardService(CreatorAuthService creatorAuthService) {
        this.creatorAuthService = creatorAuthService;
    }

    @Transactional(readOnly = true)
    public List<StoreItemResponse> getMine(String sessionToken) {
        CreatorSession session = creatorAuthService.requireSession(sessionToken);
        String roomName = session.getRoom().getRoomName();
        return Arrays.asList(
            new StoreItemResponse(roomName + " 사인 포토팩", "잔여 38개", "오늘 124건"),
            new StoreItemResponse("한정 후드 집업", "잔여 12개", "오늘 42건"),
            new StoreItemResponse("데스크 매트", "재입고 예정", "알림 신청 291명")
        );
    }
}
