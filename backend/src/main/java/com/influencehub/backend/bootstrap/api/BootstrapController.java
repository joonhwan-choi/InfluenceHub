package com.influencehub.backend.bootstrap.api;

import com.influencehub.backend.bootstrap.dto.BootstrapResponse;
import java.util.Arrays;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/bootstrap")
public class BootstrapController {

    @GetMapping("/creator-onboarding")
    public BootstrapResponse creatorOnboarding() {
        return new BootstrapResponse(
            "InfluenceHub",
            Arrays.asList("community", "event", "goods", "multi_upload"),
            Arrays.asList("youtube", "chzzk"),
            Arrays.asList(
                "SNS 로그인으로 크리에이터 가입",
                "내 팬방 생성",
                "기능 모듈 활성화",
                "업로드 후 자동 공지 생성"
            )
        );
    }

    @GetMapping("/health")
    public String health() {
        return "ok";
    }
}
