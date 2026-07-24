package com.buss.url_shortener.dto;

import java.time.LocalDateTime;

public class UrlResponse {

    private Long id;
    private String longUrl;
    private String shortCode;
    private LocalDateTime createdAt;

    public UrlResponse(Long id, String longUrl, String shortCode, LocalDateTime createdAt) {
        this.id = id;
        this.longUrl = longUrl;
        this.shortCode = shortCode;
        this.createdAt = createdAt;
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
}
