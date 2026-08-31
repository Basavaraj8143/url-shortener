package com.buss.url_shortener.dto;

import java.time.LocalDateTime;

public class UrlResponse {

    private Long id;
    private String longUrl;
    private String shortCode;
    private LocalDateTime createdAt;
    private Long clickCount;

    public UrlResponse(Long id, String longUrl, String shortCode, LocalDateTime createdAt, Long clickCount) {
        this.id = id;
        this.longUrl = longUrl;
        this.shortCode = shortCode;
        this.createdAt = createdAt;
        this.clickCount = clickCount;
    }

    public Long getId() {
        return id;
    }

    public String getLongUrl() {
        return longUrl;
    }

    public String getShortCode() {
        return shortCode;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public Long getClickCount() {
        return clickCount;
    }
}
