package com.buss.url_shortener.dto;

import java.time.LocalDateTime;

public class UrlStatsResponse {

    private Long clicks;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;

    public UrlStatsResponse(Long clicks, LocalDateTime createdAt, LocalDateTime expiresAt) {
        this.clicks = clicks;
        this.createdAt = createdAt;
        this.expiresAt = expiresAt;
    }

    public Long getClicks() {
        return clicks;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }
}
