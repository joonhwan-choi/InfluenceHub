package com.influencehub.backend.community.service;

import com.influencehub.backend.auth.domain.CreatorSession;
import com.influencehub.backend.auth.service.CreatorAuthService;
import com.influencehub.backend.community.domain.CommunityPost;
import com.influencehub.backend.community.domain.PostType;
import com.influencehub.backend.community.dto.CreateCommunityPostRequest;
import com.influencehub.backend.community.dto.CommunityPostResponse;
import com.influencehub.backend.community.dto.UpdateCommunityPostRequest;
import com.influencehub.backend.fan.repository.FanMembershipRepository;
import com.influencehub.backend.fan.service.FanSessionService;
import com.influencehub.backend.community.repository.CommunityPostRepository;
import com.influencehub.backend.room.domain.CreatorRoom;
import com.influencehub.backend.room.repository.CreatorRoomRepository;
import com.influencehub.backend.user.domain.User;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CommunityPostService {

    private final CreatorAuthService creatorAuthService;
    private final FanSessionService fanSessionService;
    private final FanMembershipRepository fanMembershipRepository;
    private final CreatorRoomRepository creatorRoomRepository;
    private final CommunityPostRepository communityPostRepository;

    public CommunityPostService(
        CreatorAuthService creatorAuthService,
        FanSessionService fanSessionService,
        FanMembershipRepository fanMembershipRepository,
        CreatorRoomRepository creatorRoomRepository,
        CommunityPostRepository communityPostRepository
    ) {
        this.creatorAuthService = creatorAuthService;
        this.fanSessionService = fanSessionService;
        this.fanMembershipRepository = fanMembershipRepository;
        this.creatorRoomRepository = creatorRoomRepository;
        this.communityPostRepository = communityPostRepository;
    }

    @Transactional
    public List<CommunityPostResponse> getCreatorRoomPosts(String sessionToken) {
        CreatorSession session = creatorAuthService.requireSession(sessionToken);
        return getOrSeedPosts(session.getRoom());
    }

    @Transactional
    public List<CommunityPostResponse> getRoomPosts(String roomSlug) {
        CreatorRoom room = creatorRoomRepository.findBySlug(roomSlug)
            .orElseThrow(() -> new IllegalStateException("팬방을 찾지 못했습니다."));
        return getOrSeedPosts(room);
    }

    @Transactional
    public CommunityPostResponse createCreatorRoomPost(String sessionToken, CreateCommunityPostRequest request) {
        CreatorSession session = creatorAuthService.requireSession(sessionToken);
        CreatorRoom room = session.getRoom();

        String title = request.getTitle() == null ? "" : request.getTitle().trim();
        String content = request.getContent() == null ? "" : request.getContent().trim();
        String imageUrl = request.getImageUrl() == null || request.getImageUrl().isBlank()
            ? null
            : request.getImageUrl().trim();

        if (title.isEmpty()) {
            throw new IllegalArgumentException("게시글 제목이 필요합니다.");
        }
        if (content.isEmpty()) {
            throw new IllegalArgumentException("게시글 본문이 필요합니다.");
        }

        CommunityPost savedPost = communityPostRepository.save(
            new CommunityPost(room, room.getOwner(), PostType.FREE, title, content, imageUrl)
        );

        return toResponse(savedPost);
    }

    @Transactional
    public CommunityPostResponse createFanRoomPost(String fanSessionToken, String roomSlug, CreateCommunityPostRequest request) {
        User fan = fanSessionService.requireFan(fanSessionToken);
        CreatorRoom room = creatorRoomRepository.findBySlug(roomSlug)
            .orElseThrow(() -> new IllegalStateException("팬방을 찾지 못했습니다."));

        fanMembershipRepository.findByFanAndRoom(fan, room)
            .orElseThrow(() -> new IllegalStateException("가입한 팬방에서만 글을 작성할 수 있습니다."));

        String title = request.getTitle() == null ? "" : request.getTitle().trim();
        String content = request.getContent() == null ? "" : request.getContent().trim();
        String imageUrl = request.getImageUrl() == null || request.getImageUrl().isBlank()
            ? null
            : request.getImageUrl().trim();

        if (title.isEmpty()) {
            throw new IllegalArgumentException("게시글 제목이 필요합니다.");
        }
        if (content.isEmpty()) {
            throw new IllegalArgumentException("게시글 본문이 필요합니다.");
        }

        CommunityPost savedPost = communityPostRepository.save(
            new CommunityPost(room, fan, PostType.FREE, title, content, imageUrl)
        );

        return toResponse(savedPost);
    }

    @Transactional
    public CommunityPostResponse updateCreatorRoomPost(String sessionToken, Long postId, UpdateCommunityPostRequest request) {
        CreatorSession session = creatorAuthService.requireSession(sessionToken);
        CreatorRoom room = session.getRoom();
        CommunityPost post = communityPostRepository.findByIdAndRoom(postId, room)
            .orElseThrow(() -> new IllegalStateException("게시글을 찾지 못했습니다."));

        String title = request.getTitle() == null ? "" : request.getTitle().trim();
        String content = request.getContent() == null ? "" : request.getContent().trim();
        String imageUrl = request.getImageUrl() == null || request.getImageUrl().isBlank()
            ? null
            : request.getImageUrl().trim();

        if (title.isEmpty()) {
            throw new IllegalArgumentException("게시글 제목이 필요합니다.");
        }
        if (content.isEmpty()) {
            throw new IllegalArgumentException("게시글 본문이 필요합니다.");
        }

        post.update(title, content, imageUrl);
        return toResponse(post);
    }

    @Transactional
    public void deleteCreatorRoomPost(String sessionToken, Long postId) {
        CreatorSession session = creatorAuthService.requireSession(sessionToken);
        CreatorRoom room = session.getRoom();
        CommunityPost post = communityPostRepository.findByIdAndRoom(postId, room)
            .orElseThrow(() -> new IllegalStateException("게시글을 찾지 못했습니다."));
        communityPostRepository.delete(post);
    }

    private List<CommunityPostResponse> getOrSeedPosts(CreatorRoom room) {
        List<CommunityPost> posts = communityPostRepository.findTop20ByRoomOrderByCreatedAtDesc(room);
        return posts.stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    private CommunityPostResponse toResponse(CommunityPost post) {
        return new CommunityPostResponse(
            post.getId(),
            post.getPostType().name(),
            post.getTitle(),
            post.getContent(),
            post.getAuthor().getNickname(),
            post.getImageUrl(),
            post.getCreatedAt()
        );
    }
}
