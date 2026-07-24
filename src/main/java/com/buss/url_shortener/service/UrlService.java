package com.buss.url_shortener.service;

import com.buss.url_shortener.dto.ShortenRequest;
import com.buss.url_shortener.dto.ShortenResponse;
import com.buss.url_shortener.dto.UrlResponse;
import com.buss.url_shortener.entity.Url;
import com.buss.url_shortener.exception.UrlNotFoundException;
import com.buss.url_shortener.repository.UrlRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class UrlService {

    private final UrlRepository urlRepository;

    public UrlService(UrlRepository urlRepository) {
        this.urlRepository = urlRepository;
    }

    public ShortenResponse createShortUrl(ShortenRequest request) {

        String shortCode =
                UUID.randomUUID()
                        .toString()
                        .substring(0, 6);

        Url url = new Url();

        url.setLongUrl(request.getLongUrl());
        url.setShortCode(shortCode);
        url.setCreatedAt(LocalDateTime.now());

        urlRepository.save(url);

        return new ShortenResponse(shortCode);
    }

    public String getLongUrl(String shortCode) {
        Url url = urlRepository.findByShortCode(shortCode)
                .orElseThrow(() -> new UrlNotFoundException("Short URL not found"));

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

    private UrlResponse toResponse(Url url) {
        return new UrlResponse(
                url.getId(),
                url.getLongUrl(),
                url.getShortCode(),
                url.getCreatedAt()
        );
    }
}
