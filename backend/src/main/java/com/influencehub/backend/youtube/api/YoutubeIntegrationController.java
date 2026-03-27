package com.influencehub.backend.youtube.api;

import com.influencehub.backend.youtube.dto.YoutubeAuthUrlResponse;
import com.influencehub.backend.youtube.dto.YoutubeConnectionResponse;
import com.influencehub.backend.youtube.dto.YoutubeConnectionSnapshotResponse;
import com.influencehub.backend.youtube.dto.YoutubeOAuthExchangeRequest;
import com.influencehub.backend.youtube.dto.YoutubeUploadResponse;
import com.influencehub.backend.youtube.service.YoutubeIntegrationService;
import java.io.IOException;
import java.net.URI;
import org.springframework.beans.factory.annotation.Value;
import javax.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriComponentsBuilder;

@RestController
@RequestMapping("/api/v1/youtube")
public class YoutubeIntegrationController {

    private final YoutubeIntegrationService youtubeIntegrationService;
    private final String frontendUrl;

    public YoutubeIntegrationController(
        YoutubeIntegrationService youtubeIntegrationService,
        @Value("${app.frontend-url:http://localhost:5173}") String frontendUrl
    ) {
        this.youtubeIntegrationService = youtubeIntegrationService;
        this.frontendUrl = frontendUrl;
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
    public ResponseEntity<Void> callback(@RequestParam("code") String code) {
        try {
            youtubeIntegrationService.exchangeCode(code);
            return buildRedirect("content", "connected", "");
        } catch (RuntimeException ex) {
            return buildRedirect("signup", "error", ex.getMessage());
        }
    }

    @GetMapping("/latest-connection")
    public YoutubeConnectionSnapshotResponse latestConnection() {
        return youtubeIntegrationService.latestConnection();
    }

    @PostMapping(
        value = "/upload",
        consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public YoutubeUploadResponse upload(
        @RequestParam(value = "accessToken", required = false) String accessToken,
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

    private ResponseEntity<Void> buildRedirect(String view, String youtubeState, String message) {
        String redirectUrl = UriComponentsBuilder.fromUriString(frontendUrl)
            .queryParam("view", view)
            .queryParam("youtube", youtubeState)
            .queryParamIfPresent(
                "message",
                message == null || message.isBlank()
                    ? java.util.Optional.empty()
                    : java.util.Optional.of(message)
            )
            .build()
            .encode()
            .toUriString();

        return ResponseEntity.status(HttpStatus.FOUND)
            .header(HttpHeaders.LOCATION, URI.create(redirectUrl).toString())
            .build();
    }
}
