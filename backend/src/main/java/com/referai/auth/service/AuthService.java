package com.referai.auth.service;

import com.referai.auth.dto.*;
import com.referai.auth.entity.RefreshToken;
import com.referai.auth.entity.Role;
import com.referai.auth.entity.User;
import com.referai.auth.repository.RefreshTokenRepository;
import com.referai.auth.repository.RoleRepository;
import com.referai.auth.repository.UserRepository;
import com.referai.common.exception.BusinessException;
import com.referai.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmailAndNotDeleted(request.getEmail())) {
            throw new BusinessException("Email already registered");
        }

        // Validate password
        if (!isValidPassword(request.getPassword())) {
            throw new BusinessException("Password must be at least 8 characters");
        }

        // Create new user
        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .status("active")
                .build();

        // Assign role based on user type
        String roleCode = request.getUserType() != null ? request.getUserType() : "ROLE_CANDIDATE";
        Role role = roleRepository.findByCode(roleCode)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + roleCode));

        user.addRole(role);
        User savedUser = userRepository.save(user);

        log.info("User registered successfully: {}", savedUser.getEmail());

        // Generate tokens
        String authorities = role.getCode();
        String accessToken = jwtService.generateAccessTokenFromEmail(savedUser.getEmail(), authorities);
        String refreshToken = generateAndSaveRefreshToken(savedUser);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .user(UserDto.from(savedUser))
                .build();
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );

            User user = userRepository.findByEmailWithRoles(request.getEmail())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));

            String authorities = user.getAuthorities().stream()
                    .map(auth -> auth.getAuthority())
                    .reduce((a, b) -> a + "," + b)
                    .orElse("");

            String accessToken = jwtService.generateAccessTokenFromEmail(user.getEmail(), authorities);
            String refreshToken = generateAndSaveRefreshToken(user);

            log.info("User logged in successfully: {}", user.getEmail());

            return AuthResponse.builder()
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .user(UserDto.from(user))
                    .build();

        } catch (Exception e) {
            log.error("Login failed for email: {}", request.getEmail());
            throw new BusinessException("Invalid email or password");
        }
    }

    @Transactional
    public AuthResponse refreshAccessToken(RefreshTokenRequest request) {
        String token = request.getRefreshToken();

        RefreshToken refreshToken = refreshTokenRepository.findValidToken(token)
                .orElseThrow(() -> new BusinessException("Invalid or expired refresh token"));

        User user = refreshToken.getUser();

        // Validate user still exists and is active
        if (!user.isEnabled()) {
            throw new BusinessException("User account is inactive");
        }

        String authorities = user.getAuthorities().stream()
                .map(auth -> auth.getAuthority())
                .reduce((a, b) -> a + "," + b)
                .orElse("");

        String newAccessToken = jwtService.generateAccessTokenFromEmail(user.getEmail(), authorities);
        String newRefreshToken = generateAndSaveRefreshToken(user);

        log.info("Access token refreshed for user: {}", user.getEmail());

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .user(UserDto.from(user))
                .build();
    }

    @Transactional
    public void logout(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        refreshTokenRepository.deleteByUserId(user.getId());
        log.info("User logged out: {}", email);
    }

    @Transactional
    public void revokeRefreshToken(String token) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new ResourceNotFoundException("Refresh token not found"));

        refreshToken.setRevoked(true);
        refreshTokenRepository.save(refreshToken);
    }

    public String generateAndSaveRefreshToken(User user) {
        // Revoke old refresh tokens
        refreshTokenRepository.deleteByUserId(user.getId());

        // Generate new refresh token
        String token = jwtService.generateRefreshToken(user.getEmail());

        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .token(token)
                .expiresAt(LocalDateTime.now().plusDays(7))
                .revoked(false)
                .build();

        refreshTokenRepository.save(refreshToken);
        return token;
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmailWithRoles(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    public User getUserById(Long id) {
        return userRepository.findByIdWithRoles(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private boolean isValidPassword(String password) {
        return password != null && password.length() >= 8;
    }
}
