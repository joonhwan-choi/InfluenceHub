package com.influencehub.backend.youtube.api;

import com.influencehub.backend.youtube.dto.YoutubeAuthUrlResponse;
import com.influencehub.backend.youtube.dto.YoutubeConnectionResponse;
import com.influencehub.backend.youtube.dto.YoutubeOAuthExchangeRequest;
import com.influencehub.backend.youtube.dto.YoutubeUploadResponse;
import com.influencehub.backend.youtube.service.YoutubeIntegrationService;
import java.io.IOException;
import javax.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/youtube")
public class YoutubeIntegrationController {

    private final YoutubeIntegrationService youtubeIntegrationService;

    public YoutubeIntegrationController(YoutubeIntegrationService youtubeIntegrationService) {
        this.youtubeIntegrationService = youtubeIntegrationService;
    }

    @GetMapping("/auth-url")
    public YoutubeAuthUrlResponse authUrl() {
        return youtubeIntegrationService.buildAuthUrl();
    }

    @PostMapping("/connect")
    public YoutubeConnectionResponse connect(@Valid @RequestBody YoutubeOAuthExchangeRequest request) {
        return youtubeIntegrationService.exchangeCode(request.getCode());
    }

    @GetMapping("/oauth/callback")
    public YoutubeConnectionResponse callback(@RequestParam("code") String code) {
        return youtubeIntegrationService.exchangeCode(code);
    }

    @PostMapping(
        value = "/upload",
        consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public YoutubeUploadResponse upload(
        @RequestParam("accessToken") String accessToken,
        @RequestParam("title") String title,
        @RequestParam(value = "description", required = false) String description,
        @RequestParam(value = "privacyStatus", required = false) String privacyStatus,
        @RequestParam("file") MultipartFile file
    ) throws IOException {
        return youtubeIntegrationService.uploadVideo(
            accessToken,
            title,
            description,
            privacyStatus,
            file
        );
    }
}
