package com.influencehub.backend.community.api;

import com.influencehub.backend.community.dto.CommunityCommentRequest;
import com.influencehub.backend.community.dto.CommunityCommentResponse;
import com.influencehub.backend.community.dto.CreateCommunityPostRequest;
import com.influencehub.backend.community.dto.CommunityPostResponse;
import com.influencehub.backend.community.dto.CommunityReactionResponse;
import com.influencehub.backend.community.dto.CommunityReportRequest;
import com.influencehub.backend.community.dto.UpdateCommunityPostRequest;
import com.influencehub.backend.community.service.CommunityPostService;
import java.util.List;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
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
    public List<CommunityPostResponse> roomPosts(
        @PathVariable String roomSlug,
        @RequestHeader(value = "Authorization", required = false) String authorizationHeader,
        @RequestParam(defaultValue = "latest") String sort
    ) {
        return communityPostService.getRoomPosts(roomSlug, extractOptionalBearerToken(authorizationHeader), sort);
    }

    @PostMapping("/mine")
    public CommunityPostResponse create(
        @RequestHeader("Authorization") String authorizationHeader,
        @RequestBody CreateCommunityPostRequest request
    ) {
        return communityPostService.createCreatorRoomPost(extractBearerToken(authorizationHeader), request);
    }

    @PostMapping("/rooms/{roomSlug}/posts")
    public CommunityPostResponse createFanPost(
        @RequestHeader("Authorization") String authorizationHeader,
        @PathVariable String roomSlug,
        @RequestBody CreateCommunityPostRequest request
    ) {
        return communityPostService.createFanRoomPost(extractBearerToken(authorizationHeader), roomSlug, request);
    }

    @PatchMapping("/mine/{postId}")
    public CommunityPostResponse update(
        @RequestHeader("Authorization") String authorizationHeader,
        @PathVariable Long postId,
        @RequestBody UpdateCommunityPostRequest request
    ) {
        return communityPostService.updateCreatorRoomPost(extractBearerToken(authorizationHeader), postId, request);
    }

    @PatchMapping("/mine/{postId}/highlight")
    public CommunityPostResponse updateHighlighted(
        @RequestHeader("Authorization") String authorizationHeader,
        @PathVariable Long postId,
        @RequestBody UpdateCommunityPostRequest request
    ) {
        boolean highlighted = request.getHighlighted() != null && request.getHighlighted();
        return communityPostService.updateHighlighted(extractBearerToken(authorizationHeader), postId, highlighted);
    }

    @GetMapping("/posts/{postId}/comments")
    public List<CommunityCommentResponse> comments(@PathVariable Long postId) {
        return communityPostService.getComments(postId);
    }

    @PostMapping("/posts/{postId}/comments")
    public CommunityCommentResponse createComment(
        @RequestHeader("Authorization") String authorizationHeader,
        @PathVariable Long postId,
        @RequestBody CommunityCommentRequest request
    ) {
        return communityPostService.createComment(postId, extractBearerToken(authorizationHeader), request);
    }

    @PostMapping("/posts/{postId}/reactions/toggle")
    public CommunityReactionResponse toggleReaction(
        @RequestHeader("Authorization") String authorizationHeader,
        @PathVariable Long postId
    ) {
        return communityPostService.toggleReaction(postId, extractBearerToken(authorizationHeader));
    }

    @PostMapping("/posts/{postId}/report")
    public void report(
        @RequestHeader("Authorization") String authorizationHeader,
        @PathVariable Long postId,
        @RequestBody CommunityReportRequest request
    ) {
        communityPostService.reportPost(postId, extractBearerToken(authorizationHeader), request);
    }

    @DeleteMapping("/mine/{postId}")
    public void delete(
        @RequestHeader("Authorization") String authorizationHeader,
        @PathVariable Long postId
    ) {
        communityPostService.deleteCreatorRoomPost(extractBearerToken(authorizationHeader), postId);
    }

    private String extractBearerToken(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new IllegalArgumentException("유효한 Bearer 토큰이 필요합니다.");
        }
        return authorizationHeader.substring("Bearer ".length()).trim();
    }

    private String extractOptionalBearerToken(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return null;
        }
        return authorizationHeader.substring("Bearer ".length()).trim();
    }
}
