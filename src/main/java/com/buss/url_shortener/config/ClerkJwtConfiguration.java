package com.buss.url_shortener.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;

import java.util.Arrays;
import java.util.List;

@Configuration
public class ClerkJwtConfiguration {

    @Value("${clerk.issuer}")
    private String issuer;

    @Value("${clerk.jwks-url}")
    private String jwksUrl;

    @Value("${cors.allowed-origins}")
    private String allowedOrigins;

    @Bean
    public JwtDecoder jwtDecoder() {
        NimbusJwtDecoder decoder = NimbusJwtDecoder.withJwkSetUri(jwksUrl).build();
        List<String> trustedOrigins = Arrays.stream(allowedOrigins.split(","))
                .map(String::trim)
                .filter(origin -> !origin.isEmpty())
                .toList();

        OAuth2TokenValidator<Jwt> authorizedPartyValidator = jwt -> {
            String authorizedParty = jwt.getClaimAsString("azp");
            if (authorizedParty == null || trustedOrigins.contains(authorizedParty)) {
                return OAuth2TokenValidatorResult.success();
            }
            return OAuth2TokenValidatorResult.failure(
                    new OAuth2Error("invalid_token", "Untrusted authorized party", null));
        };

        decoder.setJwtValidator(new DelegatingOAuth2TokenValidator<>(
                JwtValidators.createDefaultWithIssuer(issuer),
                authorizedPartyValidator));
        return decoder;
    }
}
