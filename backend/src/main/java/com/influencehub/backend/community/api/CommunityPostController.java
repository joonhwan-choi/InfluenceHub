package com.influencehub.backend.community.api;

import com.influencehub.backend.community.dto.CreateCommunityPostRequest;
import com.influencehub.backend.community.dto.CommunityPostResponse;
import com.influencehub.backend.community.service.CommunityPostService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/community")
public class CommunityPostController {

    private final CommunityPostService communityPostService;

    public CommunityPostController(CommunityPostService communityPostService) {
        this.communityPostService = communityPostService;
    }

    @GetMapping("/mine")
    public List<CommunityPostResponse> mine(@RequestHeader("Authorization") String authorizationHeader) {
        return communityPostService.getCreatorRoomPosts(extractBearerToken(authorizationHeader));
    }

    @GetMapping("/rooms/{roomSlug}/posts")
    public List<CommunityPostResponse> roomPosts(@PathVariable String roomSlug) {
        return communityPostService.getRoomPosts(roomSlug);
    }

    @PostMapping("/mine")
    public CommunityPostResponse create(
        @RequestHeader("Authorization") String authorizationHeader,
        @RequestBody CreateCommunityPostRequest request
    ) {
        return communityPostService.createCreatorRoomPost(extractBearerToken(authorizationHeader), request);
    }

    private String extractBearerToken(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new IllegalArgumentException("유효한 Bearer 토큰이 필요합니다.");
        }
        return authorizationHeader.substring("Bearer ".length()).trim();
    }
}
