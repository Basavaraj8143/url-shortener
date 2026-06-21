package com.buss.url_shortener.dto;

public class ShortenResponse {

    private String shortCode;

    public ShortenResponse(String shortCode) {
        this.shortCode = shortCode;
    }

    public String getShortCode() {
        return shortCode;
    }
}