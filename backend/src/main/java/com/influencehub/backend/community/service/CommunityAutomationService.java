package com.influencehub.backend.community.service;

import com.influencehub.backend.community.domain.CommunityPost;
import com.influencehub.backend.community.domain.PostType;
import com.influencehub.backend.community.repository.CommunityPostRepository;
import com.influencehub.backend.room.domain.CreatorRoom;
import com.influencehub.backend.user.domain.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CommunityAutomationService {

    private final CommunityPostRepository communityPostRepository;

    public CommunityAutomationService(CommunityPostRepository communityPostRepository) {
        this.communityPostRepository = communityPostRepository;
    }

    @Transactional
    public CommunityPost createUploadNotice(
        CreatorRoom room,
        User author,
        String videoTitle,
        String watchUrl,
        String privacyStatus
    ) {
        String noticeTitle = videoTitle + " 업로드 안내";
        String content = buildNoticeBody(videoTitle, watchUrl, privacyStatus);
        return communityPostRepository.save(
            new CommunityPost(room, author, PostType.NOTICE, noticeTitle, content)
        );
    }

    private String buildNoticeBody(String videoTitle, String watchUrl, String privacyStatus) {
        StringBuilder builder = new StringBuilder();
        builder.append("새 영상 ").append(videoTitle).append(" 이(가) 업로드되었습니다.");
        if (watchUrl != null && !watchUrl.isBlank()) {
            builder.append(" 바로 보기: ").append(watchUrl).append(".");
        }
        if (privacyStatus != null && !privacyStatus.isBlank()) {
            builder.append(" 공개 상태: ").append(privacyStatus).append(".");
        }
        builder.append(" 팬방 Q&A와 공지 카드도 함께 열렸습니다.");
        return builder.toString();
    }
}
