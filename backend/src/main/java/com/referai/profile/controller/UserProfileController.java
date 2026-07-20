package com.referai.profile.controller;

import com.referai.profile.dto.UserProfileDto;
import com.referai.profile.service.AvatarService;
import com.referai.profile.service.UserProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@RestController
@RequestMapping("/api/v1/profiles")
@RequiredArgsConstructor
@Tag(name = "User Profiles", description = "APIs for managing user profiles")
public class UserProfileController {

    private final UserProfileService userProfileService;
    private final AvatarService avatarService;

    @GetMapping("/{userId}")
    @Operation(summary = "Get user profile", description = "Retrieve the profile of a specific user")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Profile retrieved successfully"),
        @ApiResponse(responseCode = "404", description = "Profile not found")
    })
    public ResponseEntity<UserProfileDto> getUserProfile(@PathVariable Long userId) {
        log.debug("GET /api/v1/profiles/{}", userId);
        UserProfileDto profile = userProfileService.getUserProfile(userId);
        return ResponseEntity.ok(profile);
    }

    @GetMapping("/public/{userId}")
    @Operation(summary = "Get public profile", description = "Retrieve the public profile of a specific user")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Public profile retrieved successfully"),
        @ApiResponse(responseCode = "404", description = "Public profile not found")
    })
    public ResponseEntity<UserProfileDto> getPublicProfile(@PathVariable Long userId) {
        log.debug("GET /api/v1/profiles/public/{}", userId);
        UserProfileDto profile = userProfileService.getPublicProfile(userId);
        return ResponseEntity.ok(profile);
    }

    @PostMapping
    @Operation(summary = "Create user profile", description = "Create a new profile for a user")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Profile created successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid request body"),
        @ApiResponse(responseCode = "409", description = "Profile already exists")
    })
    public ResponseEntity<UserProfileDto> createProfile(
            @RequestParam Long userId,
            @Valid @RequestBody UserProfileDto profileDto) {
        log.info("POST /api/v1/profiles - Creating profile for user {}", userId);
        UserProfileDto created = userProfileService.createProfile(userId, profileDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{userId}")
    @Operation(summary = "Update user profile", description = "Update an existing user profile")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Profile updated successfully"),
        @ApiResponse(responseCode = "404", description = "Profile not found")
    })
    public ResponseEntity<UserProfileDto> updateProfile(
            @PathVariable Long userId,
            @Valid @RequestBody UserProfileDto profileDto) {
        log.info("PUT /api/v1/profiles/{} - Updating profile", userId);
        UserProfileDto updated = userProfileService.updateProfile(userId, profileDto);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/{userId}/avatar")
    @Operation(summary = "Upload avatar", description = "Upload or update user avatar image")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Avatar uploaded successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid file"),
        @ApiResponse(responseCode = "404", description = "Profile not found")
    })
    public ResponseEntity<UserProfileDto> uploadAvatar(
            @PathVariable Long userId,
            @RequestParam("file") MultipartFile file) {
        log.info("POST /api/v1/profiles/{}/avatar - Uploading avatar", userId);
        
        String avatarUrl = avatarService.uploadAvatar(file);
        userProfileService.updateAvatarUrl(userId, avatarUrl);
        userProfileService.updateProfileCompletion(userId);
        
        UserProfileDto profile = userProfileService.getUserProfile(userId);
        return ResponseEntity.ok(profile);
    }

    @DeleteMapping("/{userId}/avatar")
    @Operation(summary = "Delete avatar", description = "Remove user avatar image")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Avatar deleted successfully"),
        @ApiResponse(responseCode = "404", description = "Profile not found")
    })
    public ResponseEntity<Void> deleteAvatar(@PathVariable Long userId) {
        log.info("DELETE /api/v1/profiles/{}/avatar - Deleting avatar", userId);
        
        UserProfileDto profile = userProfileService.getUserProfile(userId);
        if (profile.getAvatarUrl() != null) {
            avatarService.deleteAvatar(profile.getAvatarUrl());
        }
        
        userProfileService.updateAvatarUrl(userId, null);
        userProfileService.updateProfileCompletion(userId);
        
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{userId}")
    @Operation(summary = "Delete profile", description = "Delete a user profile and all associated data")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Profile deleted successfully"),
        @ApiResponse(responseCode = "404", description = "Profile not found")
    })
    public ResponseEntity<Void> deleteProfile(@PathVariable Long userId) {
        log.warn("DELETE /api/v1/profiles/{} - Deleting profile", userId);
        userProfileService.deleteProfile(userId);
        return ResponseEntity.noContent().build();
    }
}
