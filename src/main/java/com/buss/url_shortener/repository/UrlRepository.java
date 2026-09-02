package com.buss.url_shortener.repository;

import com.buss.url_shortener.entity.Url;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UrlRepository
        extends JpaRepository<Url, Long> {

    Optional<Url> findByShortCode(String shortCode);

    Optional<Url> findByIdAndUserUsername(Long id, String username);

    List<Url> findByUserUsername(String username);

    boolean existsByShortCode(String shortCode);
}
