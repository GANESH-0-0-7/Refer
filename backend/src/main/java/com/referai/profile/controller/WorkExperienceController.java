package com.referai.profile.controller;

import com.referai.profile.dto.WorkExperienceDto;
import com.referai.profile.service.WorkExperienceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/profiles/{userId}/work-experiences")
@RequiredArgsConstructor
@Tag(name = "Work Experience", description = "APIs for managing work experiences")
public class WorkExperienceController {

    private final WorkExperienceService workExperienceService;

    @GetMapping
    @Operation(summary = "Get all work experiences", description = "Retrieve all work experiences for a user")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Work experiences retrieved successfully"),
        @ApiResponse(responseCode = "404", description = "Profile not found")
    })
    public ResponseEntity<List<WorkExperienceDto>> getWorkExperiences(@PathVariable Long userId) {
        log.debug("GET /api/v1/profiles/{}/work-experiences", userId);
        List<WorkExperienceDto> experiences = workExperienceService.getWorkExperiences(userId);
        return ResponseEntity.ok(experiences);
    }

    @PostMapping
    @Operation(summary = "Add work experience", description = "Add a new work experience to user profile")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Work experience added successfully"),
        @ApiResponse(responseCode = "404", description = "Profile not found")
    })
    public ResponseEntity<WorkExperienceDto> addWorkExperience(
            @PathVariable Long userId,
            @Valid @RequestBody WorkExperienceDto dto) {
        log.info("POST /api/v1/profiles/{}/work-experiences", userId);
        WorkExperienceDto created = workExperienceService.addWorkExperience(userId, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{experienceId}")
    @Operation(summary = "Update work experience", description = "Update an existing work experience")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Work experience updated successfully"),
        @ApiResponse(responseCode = "404", description = "Work experience not found")
    })
    public ResponseEntity<WorkExperienceDto> updateWorkExperience(
            @PathVariable Long userId,
            @PathVariable Long experienceId,
            @Valid @RequestBody WorkExperienceDto dto) {
        log.info("PUT /api/v1/profiles/{}/work-experiences/{}", userId, experienceId);
        WorkExperienceDto updated = workExperienceService.updateWorkExperience(userId, experienceId, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{experienceId}")
    @Operation(summary = "Delete work experience", description = "Remove a work experience from user profile")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Work experience deleted successfully"),
        @ApiResponse(responseCode = "404", description = "Work experience not found")
    })
    public ResponseEntity<Void> deleteWorkExperience(
            @PathVariable Long userId,
            @PathVariable Long experienceId) {
        log.warn("DELETE /api/v1/profiles/{}/work-experiences/{}", userId, experienceId);
        workExperienceService.deleteWorkExperience(userId, experienceId);
        return ResponseEntity.noContent().build();
    }
}
