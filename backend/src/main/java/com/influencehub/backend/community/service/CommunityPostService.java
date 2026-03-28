package com.influencehub.backend.community.service;

import com.influencehub.backend.auth.domain.CreatorSession;
import com.influencehub.backend.auth.service.CreatorAuthService;
import com.influencehub.backend.community.domain.CommunityComment;
import com.influencehub.backend.community.domain.CommunityPost;
import com.influencehub.backend.community.domain.CommunityReaction;
import com.influencehub.backend.community.domain.PostType;
import com.influencehub.backend.community.dto.CommunityCommentRequest;
import com.influencehub.backend.community.dto.CommunityCommentResponse;
import com.influencehub.backend.community.dto.CreateCommunityPostRequest;
import com.influencehub.backend.community.dto.CommunityPostResponse;
import com.influencehub.backend.community.dto.CommunityReactionResponse;
import com.influencehub.backend.community.dto.UpdateCommunityPostRequest;
import com.influencehub.backend.community.repository.CommunityCommentRepository;
import com.influencehub.backend.fan.repository.FanMembershipRepository;
import com.influencehub.backend.fan.service.FanSessionService;
import com.influencehub.backend.community.repository.CommunityPostRepository;
import com.influencehub.backend.community.repository.CommunityReactionRepository;
import com.influencehub.backend.room.domain.CreatorRoom;
import com.influencehub.backend.room.repository.CreatorRoomRepository;
import com.influencehub.backend.user.domain.User;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Set;
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
    private final CommunityCommentRepository communityCommentRepository;
    private final CommunityReactionRepository communityReactionRepository;

    public CommunityPostService(
        CreatorAuthService creatorAuthService,
        FanSessionService fanSessionService,
        FanMembershipRepository fanMembershipRepository,
        CreatorRoomRepository creatorRoomRepository,
        CommunityPostRepository communityPostRepository,
        CommunityCommentRepository communityCommentRepository,
        CommunityReactionRepository communityReactionRepository
    ) {
        this.creatorAuthService = creatorAuthService;
        this.fanSessionService = fanSessionService;
        this.fanMembershipRepository = fanMembershipRepository;
        this.creatorRoomRepository = creatorRoomRepository;
        this.communityPostRepository = communityPostRepository;
        this.communityCommentRepository = communityCommentRepository;
        this.communityReactionRepository = communityReactionRepository;
    }

    @Transactional
    public List<CommunityPostResponse> getCreatorRoomPosts(String sessionToken) {
        CreatorSession session = creatorAuthService.requireSession(sessionToken);
        return getPosts(session.getRoom(), null, "latest");
    }

    @Transactional
    public List<CommunityPostResponse> getRoomPosts(String roomSlug) {
        return getRoomPosts(roomSlug, null, "latest");
    }

    @Transactional
    public List<CommunityPostResponse> getRoomPosts(String roomSlug, String fanSessionToken, String sort) {
        CreatorRoom room = creatorRoomRepository.findBySlug(roomSlug)
            .orElseThrow(() -> new IllegalStateException("팬방을 찾지 못했습니다."));
        User viewer = fanSessionToken == null || fanSessionToken.isBlank() ? null : fanSessionService.requireFan(fanSessionToken);
        return getPosts(room, viewer, sort);
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

    @Transactional(readOnly = true)
    public List<CommunityCommentResponse> getComments(Long postId) {
        CommunityPost post = communityPostRepository.findById(postId)
            .orElseThrow(() -> new IllegalStateException("게시글을 찾지 못했습니다."));

        return communityCommentRepository.findByPostOrderByCreatedAtAsc(post).stream()
            .map(comment -> new CommunityCommentResponse(
                comment.getId(),
                comment.getAuthor().getNickname(),
                comment.getContent(),
                comment.getCreatedAt()
            ))
            .collect(Collectors.toList());
    }

    @Transactional
    public CommunityCommentResponse createComment(Long postId, String fanSessionToken, CommunityCommentRequest request) {
        User fan = fanSessionService.requireFan(fanSessionToken);
        CommunityPost post = communityPostRepository.findById(postId)
            .orElseThrow(() -> new IllegalStateException("게시글을 찾지 못했습니다."));

        fanMembershipRepository.findByFanAndRoom(fan, post.getRoom())
            .orElseThrow(() -> new IllegalStateException("가입한 팬방에서만 댓글을 작성할 수 있습니다."));

        String content = request.getContent() == null ? "" : request.getContent().trim();
        if (content.isEmpty()) {
            throw new IllegalArgumentException("댓글 내용이 필요합니다.");
        }

        CommunityComment saved = communityCommentRepository.save(new CommunityComment(post, fan, content));
        return new CommunityCommentResponse(saved.getId(), saved.getAuthor().getNickname(), saved.getContent(), saved.getCreatedAt());
    }

    @Transactional
    public CommunityReactionResponse toggleReaction(Long postId, String fanSessionToken) {
        User fan = fanSessionService.requireFan(fanSessionToken);
        CommunityPost post = communityPostRepository.findById(postId)
            .orElseThrow(() -> new IllegalStateException("게시글을 찾지 못했습니다."));

        fanMembershipRepository.findByFanAndRoom(fan, post.getRoom())
            .orElseThrow(() -> new IllegalStateException("가입한 팬방에서만 추천할 수 있습니다."));

        CommunityReaction existing = communityReactionRepository.findByPostAndFan(post, fan).orElse(null);
        boolean likedByViewer;
        if (existing != null) {
            communityReactionRepository.delete(existing);
            likedByViewer = false;
        } else {
            communityReactionRepository.save(new CommunityReaction(post, fan));
            likedByViewer = true;
        }

        return new CommunityReactionResponse(post.getId(), communityReactionRepository.countByPost(post), likedByViewer);
    }

    private List<CommunityPostResponse> getPosts(CreatorRoom room, User viewer, String sort) {
        List<CommunityPost> posts = communityPostRepository.findTop20ByRoomOrderByCreatedAtDesc(room);
        Map<Long, Long> reactionCounts = communityReactionRepository.findByPostIn(posts).stream()
            .collect(Collectors.groupingBy(reaction -> reaction.getPost().getId(), Collectors.counting()));
        Map<Long, Long> commentCounts = posts.stream()
            .collect(Collectors.toMap(CommunityPost::getId, communityCommentRepository::countByPost));
        Set<Long> likedPostIds = viewer == null
            ? Set.of()
            : communityReactionRepository.findByPostIn(posts).stream()
                .filter(reaction -> reaction.getFan().getId().equals(viewer.getId()))
                .map(reaction -> reaction.getPost().getId())
                .collect(Collectors.toSet());

        Comparator<CommunityPostResponse> comparator = "popular".equalsIgnoreCase(sort)
            ? Comparator.comparingLong(CommunityPostResponse::getLikeCount)
                .thenComparingLong(CommunityPostResponse::getCommentCount)
                .thenComparing(CommunityPostResponse::getCreatedAt)
                .reversed()
            : Comparator.comparing(CommunityPostResponse::getCreatedAt).reversed();

        return posts.stream()
            .map(post -> toResponse(
                post,
                reactionCounts.getOrDefault(post.getId(), 0L),
                commentCounts.getOrDefault(post.getId(), 0L),
                likedPostIds.contains(post.getId())
            ))
            .sorted(comparator)
            .collect(Collectors.toList());
    }

    private CommunityPostResponse toResponse(CommunityPost post) {
        return toResponse(post, 0L, 0L, false);
    }

    private CommunityPostResponse toResponse(CommunityPost post, long likeCount, long commentCount, boolean likedByViewer) {
        return new CommunityPostResponse(
            post.getId(),
            post.getPostType().name(),
            post.getTitle(),
            post.getContent(),
            post.getAuthor().getNickname(),
            post.getImageUrl(),
            likeCount,
            commentCount,
            likedByViewer,
            post.getCreatedAt()
        );
    }
}
