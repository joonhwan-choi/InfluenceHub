package com.influencehub.backend.room.service;

import com.influencehub.backend.auth.domain.CreatorSession;
import com.influencehub.backend.auth.service.CreatorAuthService;
import com.influencehub.backend.community.domain.CommunityPost;
import com.influencehub.backend.community.domain.PostType;
import com.influencehub.backend.community.repository.CommunityPostRepository;
import com.influencehub.backend.feature.domain.RoomFeature;
import com.influencehub.backend.feature.domain.RoomFeatureType;
import com.influencehub.backend.feature.repository.RoomFeatureRepository;
import com.influencehub.backend.room.domain.CreatorRoom;
import com.influencehub.backend.room.dto.CreatorRoomSettingsResponse;
import com.influencehub.backend.room.dto.UpdateCreatorRoomSettingsRequest;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.EnumMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CreatorRoomSettingsService {

    private static final String DEFAULT_THEME = "hub-classic";
    private static final String DEFAULT_BANNER = "focus";
    private static final String DEFAULT_BUTTON = "rounded";
    private static final String DEFAULT_DENSITY = "comfortable";
    private static final String DEFAULT_ROOM_TYPE = "community-board";
    private static final String DEFAULT_DISCORD_WEBHOOK = "";
    private static final String DEFAULT_INSTAGRAM_ACCOUNT_ID = "";
    private static final String DEFAULT_INSTAGRAM_ACCESS_TOKEN = "";
    private static final List<String> DEFAULT_FEATURES = Arrays.asList("팬 커뮤니티", "이벤트", "멀티 업로드", "굿즈 스토어");

    private final CreatorAuthService creatorAuthService;
    private final RoomFeatureRepository roomFeatureRepository;
    private final CommunityPostRepository communityPostRepository;

    public CreatorRoomSettingsService(
        CreatorAuthService creatorAuthService,
        RoomFeatureRepository roomFeatureRepository,
        CommunityPostRepository communityPostRepository
    ) {
        this.creatorAuthService = creatorAuthService;
        this.roomFeatureRepository = roomFeatureRepository;
        this.communityPostRepository = communityPostRepository;
    }

    @Transactional(readOnly = true)
    public CreatorRoomSettingsResponse getSettings(String sessionToken) {
        CreatorRoom room = requiredRoom(sessionToken);
        List<RoomFeature> roomFeatures = roomFeatureRepository.findByRoom(room);
        return toResponse(room, roomFeatures);
    }

    @Transactional
    public CreatorRoomSettingsResponse updateSettings(String sessionToken, UpdateCreatorRoomSettingsRequest request) {
        CreatorRoom room = requiredRoom(sessionToken);

        String roomThemeId = defaultIfBlank(request.getRoomThemeId(), DEFAULT_THEME);
        String bannerStyle = defaultIfBlank(request.getBannerStyle(), DEFAULT_BANNER);
        String buttonStyle = defaultIfBlank(request.getButtonStyle(), DEFAULT_BUTTON);
        String cardDensity = defaultIfBlank(request.getCardDensity(), DEFAULT_DENSITY);
        String roomLayoutType = defaultIfBlank(request.getRoomLayoutType(), DEFAULT_ROOM_TYPE);
        String discordWebhookUrl = defaultIfBlank(request.getDiscordWebhookUrl(), DEFAULT_DISCORD_WEBHOOK);
        boolean discordEnabled = request.getDiscordEnabled() != null && request.getDiscordEnabled();
        String instagramAccountId = defaultIfBlank(request.getInstagramAccountId(), DEFAULT_INSTAGRAM_ACCOUNT_ID);
        String instagramAccessToken = defaultIfBlank(request.getInstagramAccessToken(), DEFAULT_INSTAGRAM_ACCESS_TOKEN);
        boolean instagramEnabled = request.getInstagramEnabled() != null && request.getInstagramEnabled();
        room.updateAppearance(roomThemeId, bannerStyle, buttonStyle, cardDensity, roomLayoutType);
        room.updateDiscordSettings(discordWebhookUrl, discordEnabled);
        room.updateInstagramSettings(instagramAccountId, instagramAccessToken, instagramEnabled);

        List<String> selectedFeatures = request.getSelectedFeatures() == null || request.getSelectedFeatures().isEmpty()
            ? DEFAULT_FEATURES
            : request.getSelectedFeatures();

        syncRoomFeatures(room, selectedFeatures);
        seedInitialPostsIfEmpty(room, roomLayoutType);
        return toResponse(room, roomFeatureRepository.findByRoom(room));
    }

    private void seedInitialPostsIfEmpty(CreatorRoom room, String roomLayoutType) {
        if (communityPostRepository.countByRoom(room) > 0) {
            return;
        }

        List<CommunityPost> seeds = new ArrayList<>();
        switch (defaultIfBlank(roomLayoutType, DEFAULT_ROOM_TYPE)) {
            case "feed":
                seeds.add(highlightedPost(room, PostType.NOTICE, "고정 포스트 | 오늘 룩 미리보기", "저녁 업로드 전에 오늘 코디 디테일과 촬영 무드를 먼저 공개합니다."));
                seeds.add(new CommunityPost(room, room.getOwner(), PostType.FREE, "오늘 올라온 사진 톤 진짜 좋다", "민트 팝 테마처럼 밝은 분위기라 팬방 피드 분위기도 같이 살아나는 느낌."));
                seeds.add(new CommunityPost(room, room.getOwner(), PostType.QUESTION, "투표 | 다음에 보고 싶은 콘텐츠는?", "브이로그 / 먹방 / 라이브 클립 중에 다음 업로드로 보고 싶은 걸 댓글로 남겨주세요."));
                break;
            case "chat":
                seeds.add(highlightedPost(room, PostType.NOTICE, "공지 핀 | 실시간 채팅 규칙", "도배 없이 한 줄씩, 라이브 질문은 질문방처럼 남겨주시면 순서대로 읽겠습니다."));
                seeds.add(new CommunityPost(room, room.getOwner(), PostType.FREE, "실시간 오프닝 반응방", "라이브 시작하자마자 바로 반응 남기는 방입니다. 오늘 텐션 어떤지 한 줄씩 남겨봐요."));
                seeds.add(new CommunityPost(room, room.getOwner(), PostType.QUESTION, "질문방 | 오늘 라이브에서 꼭 물어보고 싶은 것", "질문이 많을 것 같아서 질문 전용 글을 먼저 열어둡니다."));
                break;
            case "challenge":
                seeds.add(highlightedPost(room, PostType.NOTICE, "공지 | 오늘의 미션은 물 2리터 마시기", "오늘 밤 11시 59분까지 인증글 올리면 출석과 함께 참여로 집계합니다."));
                seeds.add(highlightedPost(room, PostType.FREE, "출석체크 | 1일차 인증 스레드", "오늘부터 연속 참여 streak를 쌓아봅시다. 출석 완료한 팬은 한 줄 인증 남겨주세요."));
                seeds.add(new CommunityPost(room, room.getOwner(), PostType.QUESTION, "질문 | 챌린지 보상으로 어떤 혜택이 좋을까?", "배지 / 굿즈 선오픈 / 닉네임 강조 중에서 원하는 보상을 적어주세요."));
                break;
            case "fan-creation":
                seeds.add(highlightedPost(room, PostType.NOTICE, "공지 | 팬아트 / 짤 / 편집물 업로드 가이드", "매주 반응 좋은 작품은 인플루언서 PICK으로 고정하고, 팬방 메인에 다시 소개합니다."));
                seeds.add(highlightedPost(room, PostType.FREE, "팬작업 모아보기", "팬아트, 짤, 밈, 편집물 링크를 자유롭게 올리는 메인 스레드입니다."));
                seeds.add(new CommunityPost(room, room.getOwner(), PostType.QUESTION, "질문 | 이번 주 밈 소재 추천", "이번 영상에서 밈으로 쓰기 좋은 장면이나 대사를 추천해주세요."));
                break;
            case "archive":
                seeds.add(highlightedPost(room, PostType.NOTICE, "입문 가이드 | 처음 온 팬을 위한 추천 영상 5개", "이 글 하나만 보면 채널 분위기와 밈 포인트를 빠르게 따라올 수 있게 정리합니다."));
                seeds.add(new CommunityPost(room, room.getOwner(), PostType.FREE, "방송 요약 | 최근 여행편 3줄 요약", "처음 보는 팬도 흐름을 이해할 수 있게 핵심 장면만 짧게 정리합니다."));
                seeds.add(new CommunityPost(room, room.getOwner(), PostType.QUESTION, "FAQ | 팬들이 자주 묻는 질문 모음", "세계관, 별명, 대표 밈, 추천 입문 순서를 이 스레드에 계속 업데이트합니다."));
                break;
            case "community-board":
            default:
                seeds.add(highlightedPost(room, PostType.NOTICE, "공지 | 오늘 라이브는 8시 30분 시작", "라이브 끝난 뒤 팬방에서 Q&A를 이어갑니다. 질문은 질문/상담 게시판에 먼저 남겨주세요."));
                seeds.add(highlightedPost(room, PostType.FREE, "자유게시판 | 오늘 영상에서 제일 웃겼던 장면", "피자 먹방 들어가기 전에 표정 바뀌는 부분이 오늘의 레전드였다는 팬들이 많았습니다."));
                seeds.add(new CommunityPost(room, room.getOwner(), PostType.QUESTION, "질문/상담 | 다음 편 업로드는 언제일까?", "브이로그 다음 편이나 라이브 일정 궁금한 팬은 이 글에 댓글로 모아주세요."));
                break;
        }

        communityPostRepository.saveAll(seeds);
    }

    private CommunityPost highlightedPost(CreatorRoom room, PostType postType, String title, String content) {
        CommunityPost post = new CommunityPost(room, room.getOwner(), postType, title, content);
        post.updateHighlighted(true);
        return post;
    }

    private CreatorRoomSettingsResponse toResponse(CreatorRoom room, List<RoomFeature> roomFeatures) {
        List<String> selectedFeatures = roomFeatures.isEmpty()
            ? DEFAULT_FEATURES
            : roomFeatures.stream()
                .filter(RoomFeature::isEnabled)
                .map(feature -> toFeatureLabel(feature.getFeatureType()))
                .collect(Collectors.toList());

        return new CreatorRoomSettingsResponse(
            defaultIfBlank(room.getRoomThemeId(), DEFAULT_THEME),
            defaultIfBlank(room.getBannerStyle(), DEFAULT_BANNER),
            defaultIfBlank(room.getButtonStyle(), DEFAULT_BUTTON),
            defaultIfBlank(room.getCardDensity(), DEFAULT_DENSITY),
            defaultIfBlank(room.getRoomLayoutType(), DEFAULT_ROOM_TYPE),
            defaultIfBlank(room.getDiscordWebhookUrl(), DEFAULT_DISCORD_WEBHOOK),
            room.isDiscordEnabled(),
            defaultIfBlank(room.getInstagramAccountId(), DEFAULT_INSTAGRAM_ACCOUNT_ID),
            defaultIfBlank(room.getInstagramAccessToken(), DEFAULT_INSTAGRAM_ACCESS_TOKEN),
            room.isInstagramEnabled(),
            selectedFeatures
        );
    }

    private void syncRoomFeatures(CreatorRoom room, List<String> selectedFeatures) {
        Map<RoomFeatureType, RoomFeature> featureMap = new EnumMap<>(RoomFeatureType.class);
        for (RoomFeature feature : roomFeatureRepository.findByRoom(room)) {
            featureMap.put(feature.getFeatureType(), feature);
        }

        List<RoomFeature> updates = new ArrayList<>();
        for (RoomFeatureType featureType : RoomFeatureType.values()) {
            boolean enabled = selectedFeatures.stream().anyMatch(label -> toFeatureType(label) == featureType);
            RoomFeature existing = featureMap.get(featureType);
            if (existing == null) {
                updates.add(new RoomFeature(room, featureType, enabled));
                continue;
            }
            if (existing.isEnabled() != enabled) {
                existing.updateEnabled(enabled);
            }
            updates.add(existing);
        }

        roomFeatureRepository.saveAll(updates);
    }

    private CreatorRoom requiredRoom(String sessionToken) {
        CreatorSession session = creatorAuthService.requireSession(sessionToken);
        return session.getRoom();
    }

    private String defaultIfBlank(String value, String fallback) {
        return value == null || value.trim().isEmpty() ? fallback : value.trim();
    }

    private RoomFeatureType toFeatureType(String label) {
        String normalized = label == null ? "" : label.trim().toLowerCase(Locale.ROOT);
        if (normalized.equals("팬 커뮤니티")) {
            return RoomFeatureType.COMMUNITY;
        }
        if (normalized.equals("이벤트")) {
            return RoomFeatureType.EVENT;
        }
        if (normalized.equals("굿즈 스토어")) {
            return RoomFeatureType.GOODS;
        }
        if (normalized.equals("멀티 업로드")) {
            return RoomFeatureType.MULTI_UPLOAD;
        }
        if (normalized.equals("멤버십 라운지")) {
            return RoomFeatureType.MEMBERSHIP;
        }
        if (normalized.equals("라이브 채팅")) {
            return RoomFeatureType.LIVE_CHAT;
        }
        return RoomFeatureType.COMMUNITY;
    }

    private String toFeatureLabel(RoomFeatureType featureType) {
        switch (featureType) {
            case COMMUNITY:
                return "팬 커뮤니티";
            case EVENT:
                return "이벤트";
            case GOODS:
                return "굿즈 스토어";
            case MEMBERSHIP:
                return "멤버십 라운지";
            case MULTI_UPLOAD:
                return "멀티 업로드";
            case LIVE_CHAT:
                return "라이브 채팅";
            case POLL:
                return "투표";
            default:
                return "팬 커뮤니티";
        }
    }
}
