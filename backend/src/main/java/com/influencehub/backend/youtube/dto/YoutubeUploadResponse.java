package com.influencehub.backend.youtube.dto;

public class YoutubeUploadResponse {

    private final String videoId;
    private final String title;
    private final String privacyStatus;
    private final String watchUrl;

    public YoutubeUploadResponse(String videoId, String title, String privacyStatus, String watchUrl) {
        this.videoId = videoId;
        this.title = title;
        this.privacyStatus = privacyStatus;
        this.watchUrl = watchUrl;
    }

    public String getVideoId() {
        return videoId;
    }

    public String getTitle() {
        return title;
    }

    public String getPrivacyStatus() {
        return privacyStatus;
    }

    public String getWatchUrl() {
        return watchUrl;
    }
}
