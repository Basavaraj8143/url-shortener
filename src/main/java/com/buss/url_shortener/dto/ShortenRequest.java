package com.buss.url_shortener.dto;

import org.hibernate.validator.constraints.URL;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class ShortenRequest {

    @NotBlank(message = "Long URL is required")
    @URL(message = "Long URL must be valid")
    private String longUrl;

    @Size(min = 3, max = 30, message = "Custom alias must be 3 to 30 characters")
    @Pattern(regexp = "^[a-zA-Z0-9_-]+$", message = "Custom alias can contain only letters, numbers, underscore, and hyphen")
    private String customAlias;

    @Min(value = 1, message = "Expiry must be at least 1 day")
    @Max(value = 365, message = "Expiry cannot exceed 365 days")
    private Integer expiryDays;

    public String getLongUrl() {
        return longUrl;
    }

    public void setLongUrl(String longUrl) {
        this.longUrl = longUrl;
    }

    public String getCustomAlias() {
        return customAlias;
    }

    public void setCustomAlias(String customAlias) {
        this.customAlias = customAlias;
    }

    public Integer getExpiryDays() {
        return expiryDays;
    }

    public void setExpiryDays(Integer expiryDays) {
        this.expiryDays = expiryDays;
    }
}
