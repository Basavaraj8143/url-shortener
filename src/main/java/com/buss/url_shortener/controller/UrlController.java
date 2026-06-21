package com.buss.url_shortener.controller;

import com.buss.url_shortener.dto.ShortenRequest;
import com.buss.url_shortener.dto.ShortenResponse;
import com.buss.url_shortener.service.UrlService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/urls")
public class UrlController {

    private final UrlService urlService;

    public UrlController(UrlService urlService) {
        this.urlService = urlService;
    }

    @PostMapping
    public ShortenResponse createShortUrl(
            @RequestBody ShortenRequest request) {

        return urlService.createShortUrl(request);
    }
}