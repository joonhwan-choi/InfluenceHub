package com.influencehub.backend.store.api;

import com.influencehub.backend.store.dto.StoreItemResponse;
import com.influencehub.backend.store.service.StoreBoardService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/store")
public class StoreBoardController {

    private final StoreBoardService storeBoardService;

    public StoreBoardController(StoreBoardService storeBoardService) {
        this.storeBoardService = storeBoardService;
    }

    @GetMapping("/mine")
    public List<StoreItemResponse> mine(@RequestHeader("Authorization") String authorizationHeader) {
        return storeBoardService.getMine(extractBearerToken(authorizationHeader));
    }

    private String extractBearerToken(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new IllegalArgumentException("유효한 Bearer 토큰이 필요합니다.");
        }
        return authorizationHeader.substring("Bearer ".length()).trim();
    }
}
