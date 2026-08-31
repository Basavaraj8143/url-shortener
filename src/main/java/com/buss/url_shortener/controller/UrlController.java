package com.buss.url_shortener.controller;

import com.buss.url_shortener.dto.ShortenRequest;
import com.buss.url_shortener.dto.ShortenResponse;
import com.buss.url_shortener.dto.UrlResponse;
import com.buss.url_shortener.dto.UrlStatsResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import com.buss.url_shortener.service.UrlService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/urls")
public class UrlController {

    private final UrlService urlService;

    public UrlController(UrlService urlService) {
        this.urlService = urlService;
    }

    @PostMapping
    public ShortenResponse createShortUrl(
            @Valid @RequestBody ShortenRequest request) {

        return urlService.createShortUrl(request);
    }

    @GetMapping
    public List<UrlResponse> getAllUrls() {
        return urlService.getAllUrls();
    }

    @GetMapping("/{id}/stats")
    public UrlStatsResponse getUrlStats(@PathVariable Long id) {
        return urlService.getUrlStats(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUrl(@PathVariable Long id) {
        urlService.deleteUrl(id);
        return ResponseEntity.noContent().build();
    }
}
