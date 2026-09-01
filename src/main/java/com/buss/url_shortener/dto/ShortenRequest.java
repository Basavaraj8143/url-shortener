package com.buss.url_shortener.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import org.hibernate.validator.constraints.URL;

public class ShortenRequest {

    @NotBlank(message = "Long URL is required")
    @URL(message = "Long URL must be valid")
    private String longUrl;

    @Size(min = 3, max = 30, message = "Custom alias must be 3 to 30 characters")
    @Pattern(regexp = "^[a-zA-Z0-9_-]+$", message = "Custom alias can contain only letters, numbers, underscore, and hyphen")
    private String customAlias;

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
}
