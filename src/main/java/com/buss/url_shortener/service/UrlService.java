package com.buss.url_shortener.service;

import com.buss.url_shortener.dto.ShortenRequest;
import com.buss.url_shortener.dto.ShortenResponse;
import com.buss.url_shortener.dto.UrlResponse;
import com.buss.url_shortener.dto.UrlStatsResponse;
import com.buss.url_shortener.entity.Url;
import com.buss.url_shortener.exception.DuplicateAliasException;
import com.buss.url_shortener.exception.UrlExpiredException;
import com.buss.url_shortener.exception.UrlNotFoundException;
import com.buss.url_shortener.repository.UrlRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class UrlService {

    private static final int SHORT_CODE_LENGTH = 6;
    private static final int DEFAULT_EXPIRY_DAYS = 7;

    private final UrlRepository urlRepository;

    public UrlService(UrlRepository urlRepository) {
        this.urlRepository = urlRepository;
    }

    public ShortenResponse createShortUrl(ShortenRequest request) {

        String shortCode = resolveShortCode(request);
        LocalDateTime createdAt = LocalDateTime.now();

        Url url = new Url();

        url.setLongUrl(request.getLongUrl());
        url.setShortCode(shortCode);
        url.setCreatedAt(createdAt);
        url.setClickCount(0L);
        url.setExpiresAt(createdAt.plusDays(DEFAULT_EXPIRY_DAYS));

        urlRepository.save(url);

        return new ShortenResponse(shortCode, url.getExpiresAt());
    }

    public String getLongUrl(String shortCode) {
        Url url = urlRepository.findByShortCode(shortCode)
                .orElseThrow(() -> new UrlNotFoundException("Short URL not found"));

        if (isExpired(url)) {
            throw new UrlExpiredException("Short URL has expired");
        }

        url.setClickCount(getClickCount(url) + 1);
        urlRepository.save(url);

        return url.getLongUrl();
    }

    public List<UrlResponse> getAllUrls() {
        return urlRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public void deleteUrl(Long id) {
        if (!urlRepository.existsById(id)) {
            throw new UrlNotFoundException("URL not found");
        }

        urlRepository.deleteById(id);
    }

    public UrlStatsResponse getUrlStats(Long id) {
        Url url = urlRepository.findById(id)
                .orElseThrow(() -> new UrlNotFoundException("URL not found"));

        return new UrlStatsResponse(
                getClickCount(url),
                url.getCreatedAt(),
                url.getExpiresAt()
        );
    }

    private UrlResponse toResponse(Url url) {
        return new UrlResponse(
                url.getId(),
                url.getLongUrl(),
                url.getShortCode(),
                url.getCreatedAt(),
                getClickCount(url),
                url.getExpiresAt()
        );
    }

    private Long getClickCount(Url url) {
        return url.getClickCount() == null ? 0L : url.getClickCount();
    }

    private String resolveShortCode(ShortenRequest request) {
        String customAlias = request.getCustomAlias();

        if (customAlias != null && !customAlias.isBlank()) {
            String alias = customAlias.trim();

            if (urlRepository.existsByShortCode(alias)) {
                throw new DuplicateAliasException("Custom alias already exists");
            }

            return alias;
        }

        return generateUniqueShortCode();
    }

    private String generateUniqueShortCode() {
        String shortCode;

        do {
            shortCode = UUID.randomUUID()
                    .toString()
                    .substring(0, SHORT_CODE_LENGTH);
        } while (urlRepository.existsByShortCode(shortCode));

        return shortCode;
    }

    private boolean isExpired(Url url) {
        return url.getExpiresAt() != null && LocalDateTime.now().isAfter(url.getExpiresAt());
    }
}
