package com.buss.url_shortener.dto;

import java.time.LocalDateTime;

public class UrlStatsResponse {

    private Long clicks;
    private LocalDateTime createdAt;

    public UrlStatsResponse(Long clicks, LocalDateTime createdAt) {
        this.clicks = clicks;
        this.createdAt = createdAt;
    }

    public Long getClicks() {
        return clicks;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
