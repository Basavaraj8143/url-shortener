package com.buss.url_shortener.service;

import com.buss.url_shortener.dto.AuthResponse;
import com.buss.url_shortener.dto.LoginRequest;
import com.buss.url_shortener.dto.RegisterRequest;
import com.buss.url_shortener.entity.AppUser;
import com.buss.url_shortener.exception.DuplicateUsernameException;
import com.buss.url_shortener.exception.InvalidCredentialsException;
import com.buss.url_shortener.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponse register(RegisterRequest request) {
        String username = request.getUsername().trim();

        if (userRepository.existsByUsername(username)) {
            throw new DuplicateUsernameException("Username already exists");
        }

        AppUser user = new AppUser();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setCreatedAt(LocalDateTime.now());

        userRepository.save(user);

        return new AuthResponse(jwtService.generateToken(username), username);
    }

    public AuthResponse login(LoginRequest request) {
        String username = request.getUsername().trim();

        AppUser user = userRepository.findByUsername(username)
                .orElseThrow(() -> new InvalidCredentialsException("Invalid username or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid username or password");
        }

        return new AuthResponse(jwtService.generateToken(username), username);
    }
}
