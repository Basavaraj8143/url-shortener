package com.buss.url_shortener.service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import com.buss.url_shortener.dto.ShortenRequest;
import com.buss.url_shortener.dto.ShortenResponse;
import com.buss.url_shortener.dto.UrlResponse;
import com.buss.url_shortener.dto.UrlStatsResponse;
import com.buss.url_shortener.entity.AppUser;
import com.buss.url_shortener.entity.Url;
import com.buss.url_shortener.exception.DuplicateAliasException;
import com.buss.url_shortener.exception.UrlExpiredException;
import com.buss.url_shortener.exception.UrlNotFoundException;
import com.buss.url_shortener.repository.UrlRepository;
import com.buss.url_shortener.repository.UserRepository;

@Service
public class UrlService {

    private static final int SHORT_CODE_LENGTH = 6;
    private static final int DEFAULT_EXPIRY_DAYS = 7;
    private static final String REDIRECT_CACHE_PREFIX = "url:redirect:";

    private final UrlRepository urlRepository;
    private final UserRepository userRepository;
    private final StringRedisTemplate redisTemplate;

    public UrlService(
            UrlRepository urlRepository,
            UserRepository userRepository,
            StringRedisTemplate redisTemplate) {
        this.urlRepository = urlRepository;
        this.userRepository = userRepository;
        this.redisTemplate = redisTemplate;
    }

    public ShortenResponse createShortUrl(ShortenRequest request, String username) {

        String shortCode = resolveShortCode(request);
        LocalDateTime createdAt = LocalDateTime.now();
        AppUser user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UrlNotFoundException("User not found"));

        Url url = new Url();

        url.setLongUrl(request.getLongUrl());
        url.setShortCode(shortCode);
        url.setCreatedAt(createdAt);
        url.setClickCount(0L);
        url.setExpiresAt(createdAt.plusDays(DEFAULT_EXPIRY_DAYS));
        url.setUser(user);

        urlRepository.save(url);

        return new ShortenResponse(shortCode, url.getExpiresAt());
    }

    public String getLongUrl(String shortCode) {
        String cachedLongUrl = getCachedLongUrl(shortCode);
        if (cachedLongUrl != null) {
            Url url = urlRepository.findByShortCode(shortCode)
                    .orElseThrow(() -> new UrlNotFoundException("Short URL not found"));

            if (isExpired(url)) {
                evictCachedLongUrl(shortCode);
                throw new UrlExpiredException("Short URL has expired");
            }

            url.setClickCount(getClickCount(url) + 1);
            urlRepository.save(url);
            return cachedLongUrl;
        }

        Url url = urlRepository.findByShortCode(shortCode)
                .orElseThrow(() -> new UrlNotFoundException("Short URL not found"));

        if (isExpired(url)) {
            throw new UrlExpiredException("Short URL has expired");
        }

        url.setClickCount(getClickCount(url) + 1);
        urlRepository.save(url);
        cacheLongUrl(url);

        return url.getLongUrl();
    }

    public List<UrlResponse> getAllUrls(String username) {
        return urlRepository.findByUserUsername(username)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public void deleteUrl(Long id, String username) {
        Url url = urlRepository.findByIdAndUserUsername(id, username)
                .orElseThrow(() -> new UrlNotFoundException("URL not found"));

        urlRepository.delete(url);
        evictCachedLongUrl(url.getShortCode());
    }

    public UrlStatsResponse getUrlStats(Long id, String username) {
        Url url = urlRepository.findByIdAndUserUsername(id, username)
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

    private String getCachedLongUrl(String shortCode) {
        try {
            return redisTemplate.opsForValue().get(cacheKey(shortCode));
        } catch (RuntimeException exception) {
            return null;
        }
    }

    private void cacheLongUrl(Url url) {
        if (url.getExpiresAt() == null) {
            return;
        }

        Duration timeToLive = Duration.between(LocalDateTime.now(), url.getExpiresAt());
        if (timeToLive.isZero() || timeToLive.isNegative()) {
            return;
        }

        try {
            redisTemplate.opsForValue().set(cacheKey(url.getShortCode()), url.getLongUrl(), timeToLive);
        } catch (RuntimeException ignored) {
            // Redis is an optimization; database redirects remain available.
        }
    }

    private void evictCachedLongUrl(String shortCode) {
        try {
            redisTemplate.delete(cacheKey(shortCode));
        } catch (RuntimeException ignored) {
            // Redis is an optimization; deletion is already complete in MySQL.
        }
    }

    private String cacheKey(String shortCode) {
        return REDIRECT_CACHE_PREFIX + shortCode;
    }
}
