package com.referai.profile.controller;

import com.referai.profile.dto.EducationDto;
import com.referai.profile.service.EducationService;
import io.swagger.v3.oas.annotations.Operation;
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
@RequestMapping("/api/v1/profiles/{userId}/educations")
@RequiredArgsConstructor
@Tag(name = "Education", description = "APIs for managing user education")
public class EducationController {

    private final EducationService educationService;

    @GetMapping
    @Operation(summary = "Get all educations", description = "Retrieve all education entries for a user")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Educations retrieved successfully"),
        @ApiResponse(responseCode = "404", description = "Profile not found")
    })
    public ResponseEntity<List<EducationDto>> getEducations(@PathVariable Long userId) {
        log.debug("GET /api/v1/profiles/{}/educations", userId);
        List<EducationDto> educations = educationService.getEducations(userId);
        return ResponseEntity.ok(educations);
    }

    @PostMapping
    @Operation(summary = "Add education", description = "Add a new education entry to user profile")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Education added successfully"),
        @ApiResponse(responseCode = "404", description = "Profile not found")
    })
    public ResponseEntity<EducationDto> addEducation(
            @PathVariable Long userId,
            @Valid @RequestBody EducationDto dto) {
        log.info("POST /api/v1/profiles/{}/educations", userId);
        EducationDto created = educationService.addEducation(userId, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{educationId}")
    @Operation(summary = "Update education", description = "Update an existing education entry")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Education updated successfully"),
        @ApiResponse(responseCode = "404", description = "Education not found")
    })
    public ResponseEntity<EducationDto> updateEducation(
            @PathVariable Long userId,
            @PathVariable Long educationId,
            @Valid @RequestBody EducationDto dto) {
        log.info("PUT /api/v1/profiles/{}/educations/{}", userId, educationId);
        EducationDto updated = educationService.updateEducation(userId, educationId, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{educationId}")
    @Operation(summary = "Delete education", description = "Remove an education entry from user profile")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Education deleted successfully"),
        @ApiResponse(responseCode = "404", description = "Education not found")
    })
    public ResponseEntity<Void> deleteEducation(
            @PathVariable Long userId,
            @PathVariable Long educationId) {
        log.warn("DELETE /api/v1/profiles/{}/educations/{}", userId, educationId);
        educationService.deleteEducation(userId, educationId);
        return ResponseEntity.noContent().build();
    }
}
