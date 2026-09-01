package com.buss.url_shortener.dto;

import java.time.LocalDateTime;

public class ShortenResponse {

    private String shortCode;
    private LocalDateTime expiresAt;

    public ShortenResponse(String shortCode, LocalDateTime expiresAt) {
        this.shortCode = shortCode;
        this.expiresAt = expiresAt;
    }

    public String getShortCode() {
        return shortCode;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }
}
