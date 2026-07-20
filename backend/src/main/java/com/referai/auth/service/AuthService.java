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
import com.referai.profile.entity.UserProfile;
import com.referai.profile.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final UserProfileRepository userProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmailAndNotDeleted(request.getEmail())) {
            throw new BusinessException("Email already registered");
        }

        if (!isValidPassword(request.getPassword())) {
            throw new BusinessException("Password must be at least 8 characters");
        }

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .status("active")
                .build();

        String roleCode = "ROLE_CANDIDATE";

        if (request.getUserType() != null && !request.getUserType().isBlank()) {
            roleCode = request.getUserType().toUpperCase();

            if (!roleCode.startsWith("ROLE_")) {
                roleCode = "ROLE_" + roleCode;
            }
        }

        Role role = roleRepository.findByCode(roleCode)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Role not found: " + roleCode));

        user.addRole(role);

        User savedUser = userRepository.save(user);

        // Automatically create profile for new user
        if (!userProfileRepository.existsByUserId(savedUser.getId())) {

            UserProfile profile = UserProfile.builder()
                    .userId(savedUser.getId())
                    .profileVisibility("PUBLIC")
                    .profileCompletion(0)
                    .build();

            userProfileRepository.save(profile);
        }

        log.info("User registered successfully: {}", savedUser.getEmail());

        String authorities = role.getCode();

        String accessToken =
                jwtService.generateAccessTokenFromEmail(
                        savedUser.getEmail(),
                        authorities
                );

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

            Authentication authentication =
                    authenticationManager.authenticate(
                            new UsernamePasswordAuthenticationToken(
                                    request.getEmail(),
                                    request.getPassword()
                            )
                    );

            User user = userRepository.findByEmailWithRoles(request.getEmail())
                    .orElseThrow(() ->
                            new ResourceNotFoundException("User not found"));

            String authorities = user.getAuthorities().stream()
                    .map(auth -> auth.getAuthority())
                    .reduce((a, b) -> a + "," + b)
                    .orElse("");

            String accessToken =
                    jwtService.generateAccessTokenFromEmail(
                            user.getEmail(),
                            authorities
                    );

            String refreshToken = generateAndSaveRefreshToken(user);

            log.info("User logged in successfully: {}", user.getEmail());

            return AuthResponse.builder()
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .user(UserDto.from(user))
                    .build();

        } catch (Exception e) {

            log.error("Login failed for email: {}", request.getEmail(), e);

            throw new BusinessException("Invalid email");