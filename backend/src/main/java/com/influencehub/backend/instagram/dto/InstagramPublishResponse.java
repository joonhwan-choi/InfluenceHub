package com.influencehub.backend.instagram.dto;

public class InstagramPublishResponse {

    private final String status;
    private final String mediaId;
    private final String permalink;

    public InstagramPublishResponse(String status, String mediaId, String permalink) {
        this.status = status;
        this.mediaId = mediaId;
        this.permalink = permalink;
    }

    public String getStatus() {
        return status;
    }

    public String getMediaId() {
        return mediaId;
    }

    public String getPermalink() {
        return permalink;
    }
}
