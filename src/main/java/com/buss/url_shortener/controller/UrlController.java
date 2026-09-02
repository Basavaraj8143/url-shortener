package com.buss.url_shortener.controller;

import com.buss.url_shortener.dto.ShortenRequest;
import com.buss.url_shortener.dto.ShortenResponse;
import com.buss.url_shortener.dto.UrlResponse;
import com.buss.url_shortener.dto.UrlStatsResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import com.buss.url_shortener.service.UrlService;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
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
            @Valid @RequestBody ShortenRequest request,
            Principal principal) {

        return urlService.createShortUrl(request, principal.getName());
    }

    @GetMapping
    public List<UrlResponse> getAllUrls(Principal principal) {
        return urlService.getAllUrls(principal.getName());
    }

    @GetMapping("/{id}/stats")
    public UrlStatsResponse getUrlStats(@PathVariable Long id, Principal principal) {
        return urlService.getUrlStats(id, principal.getName());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUrl(@PathVariable Long id, Principal principal) {
        urlService.deleteUrl(id, principal.getName());
        return ResponseEntity.noContent().build();
    }
}
