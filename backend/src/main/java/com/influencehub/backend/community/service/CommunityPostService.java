package com.influencehub.backend.community.service;

import com.influencehub.backend.auth.domain.CreatorSession;
import com.influencehub.backend.auth.service.CreatorAuthService;
import com.influencehub.backend.community.domain.CommunityPost;
import com.influencehub.backend.community.domain.PostType;
import com.influencehub.backend.community.dto.CreateCommunityPostRequest;
import com.influencehub.backend.community.dto.CommunityPostResponse;
import com.influencehub.backend.community.repository.CommunityPostRepository;
import com.influencehub.backend.room.domain.CreatorRoom;
import com.influencehub.backend.room.repository.CreatorRoomRepository;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CommunityPostService {

    private final CreatorAuthService creatorAuthService;
    private final CreatorRoomRepository creatorRoomRepository;
    private final CommunityPostRepository communityPostRepository;

    public CommunityPostService(
        CreatorAuthService creatorAuthService,
        CreatorRoomRepository creatorRoomRepository,
        CommunityPostRepository communityPostRepository
    ) {
        this.creatorAuthService = creatorAuthService;
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

    private List<CommunityPostResponse> getOrSeedPosts(CreatorRoom room) {
        List<CommunityPost> posts = communityPostRepository.findTop20ByRoomOrderByCreatedAtDesc(room);
        if (posts.isEmpty()) {
            posts = communityPostRepository.saveAll(
                Arrays.asList(
                    new CommunityPost(room, room.getOwner(), PostType.NOTICE, "오늘 밤 8시 본편 공개 + 팬방 Q&A", "영상 공개 직후 팬방 Q&A를 바로 엽니다. 보고 궁금한 점 남겨주세요."),
                    new CommunityPost(room, room.getOwner(), PostType.EVENT, "미션 인증 이벤트 오픈", "댓글 인증만 해도 추첨으로 사인 굿즈를 받을 수 있습니다."),
                    new CommunityPost(room, room.getOwner(), PostType.FREE, "비하인드 사진 선공개", "다음 프로젝트 비하인드 사진과 제작 메모를 먼저 올려뒀습니다.")
                )
            );
        }

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
