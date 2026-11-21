package com.buss.url_shortener.config;

import com.buss.url_shortener.entity.AppUser;
import com.buss.url_shortener.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.UUID;

public class ClerkUserProvisioningFilter extends OncePerRequestFilter {

    private final UserRepository userRepository;

    public ClerkUserProvisioningFilter(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication instanceof JwtAuthenticationToken clerkAuthentication) {
            String clerkUserId = clerkAuthentication.getToken().getSubject();
            if (clerkUserId != null && !clerkUserId.isBlank()) {
                userRepository.findByUsername(clerkUserId).orElseGet(() -> {
                    AppUser user = new AppUser();
                    user.setUsername(clerkUserId);
                    // Password login is disabled; this satisfies the legacy non-null column.
                    user.setPassword("clerk:" + UUID.randomUUID());
                    user.setCreatedAt(LocalDateTime.now());
                    return userRepository.save(user);
                });
            }
        }

        filterChain.doFilter(request, response);
    }
}
