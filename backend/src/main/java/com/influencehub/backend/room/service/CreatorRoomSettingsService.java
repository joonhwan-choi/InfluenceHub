package com.influencehub.backend.room.service;

import com.influencehub.backend.auth.domain.CreatorSession;
import com.influencehub.backend.auth.service.CreatorAuthService;
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
    private static final List<String> DEFAULT_FEATURES = Arrays.asList("팬 커뮤니티", "이벤트", "멀티 업로드", "굿즈 스토어");

    private final CreatorAuthService creatorAuthService;
    private final RoomFeatureRepository roomFeatureRepository;

    public CreatorRoomSettingsService(
        CreatorAuthService creatorAuthService,
        RoomFeatureRepository roomFeatureRepository
    ) {
        this.creatorAuthService = creatorAuthService;
        this.roomFeatureRepository = roomFeatureRepository;
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
        room.updateAppearance(roomThemeId, bannerStyle, buttonStyle, cardDensity);

        List<String> selectedFeatures = request.getSelectedFeatures() == null || request.getSelectedFeatures().isEmpty()
            ? DEFAULT_FEATURES
            : request.getSelectedFeatures();

        syncRoomFeatures(room, selectedFeatures);
        return toResponse(room, roomFeatureRepository.findByRoom(room));
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
