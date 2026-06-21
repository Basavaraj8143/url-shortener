package com.buss.url_shortener.service;

import com.buss.url_shortener.dto.ShortenRequest;
import com.buss.url_shortener.dto.ShortenResponse;
import com.buss.url_shortener.entity.Url;
import com.buss.url_shortener.repository.UrlRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
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
}