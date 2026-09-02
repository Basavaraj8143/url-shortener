package com.buss.url_shortener.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.Base64;
import java.util.Map;

@Service
public class JwtService {

    private static final String HMAC_ALGORITHM = "HmacSHA256";
    private static final Base64.Encoder BASE64_URL_ENCODER = Base64.getUrlEncoder().withoutPadding();
    private static final Base64.Decoder BASE64_URL_DECODER = Base64.getUrlDecoder();

    private final ObjectMapper objectMapper;
    private final String jwtSecret;
    private final long jwtExpirationMs;

    public JwtService(
            ObjectMapper objectMapper,
            @Value("${jwt.secret:development-secret-change-me-development-secret-change-me}") String jwtSecret,
            @Value("${jwt.expiration-ms:86400000}") long jwtExpirationMs) {

        this.objectMapper = objectMapper;
        this.jwtSecret = jwtSecret;
        this.jwtExpirationMs = jwtExpirationMs;
    }

    public String generateToken(String username) {
        long issuedAt = Instant.now().toEpochMilli();
        long expiresAt = issuedAt + jwtExpirationMs;

        String header = encodeJson(Map.of(
                "alg", "HS256",
                "typ", "JWT"
        ));
        String payload = encodeJson(Map.of(
                "sub", username,
                "iat", issuedAt,
                "exp", expiresAt
        ));

        String unsignedToken = header + "." + payload;

        return unsignedToken + "." + sign(unsignedToken);
    }

    public String extractUsername(String token) {
        Map<String, Object> claims = extractClaims(token);

        Object subject = claims.get("sub");
        return subject instanceof String username ? username : null;
    }

    public boolean isTokenValid(String token, String username) {
        String tokenUsername = extractUsername(token);

        return username.equals(tokenUsername) && !isExpired(token);
    }

    private boolean isExpired(String token) {
        Map<String, Object> claims = extractClaims(token);
        Object expiration = claims.get("exp");

        if (expiration instanceof Number expirationNumber) {
            return Instant.now().toEpochMilli() > expirationNumber.longValue();
        }

        return true;
    }

    private Map<String, Object> extractClaims(String token) {
        String[] parts = token.split("\\.");

        if (parts.length != 3) {
            throw new IllegalArgumentException("Invalid JWT");
        }

        String unsignedToken = parts[0] + "." + parts[1];
        String expectedSignature = sign(unsignedToken);

        if (!MessageDigest.isEqual(
                expectedSignature.getBytes(StandardCharsets.UTF_8),
                parts[2].getBytes(StandardCharsets.UTF_8))) {

            throw new IllegalArgumentException("Invalid JWT signature");
        }

        try {
            byte[] payloadBytes = BASE64_URL_DECODER.decode(parts[1]);
            return objectMapper.readValue(payloadBytes, new TypeReference<>() {
            });
        } catch (Exception exception) {
            throw new IllegalArgumentException("Invalid JWT payload", exception);
        }
    }

    private String encodeJson(Map<String, Object> value) {
        try {
            return BASE64_URL_ENCODER.encodeToString(objectMapper.writeValueAsBytes(value));
        } catch (Exception exception) {
            throw new IllegalStateException("Could not create JWT", exception);
        }
    }

    private String sign(String value) {
        try {
            Mac mac = Mac.getInstance(HMAC_ALGORITHM);
            mac.init(new SecretKeySpec(jwtSecret.getBytes(StandardCharsets.UTF_8), HMAC_ALGORITHM));
            return BASE64_URL_ENCODER.encodeToString(mac.doFinal(value.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception exception) {
            throw new IllegalStateException("Could not sign JWT", exception);
        }
    }
}
