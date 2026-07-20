package com.referai.profile.controller;

import com.referai.profile.dto.SkillDto;
import com.referai.profile.service.SkillService;
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
@RequestMapping("/api/v1/profiles/{userId}/skills")
@RequiredArgsConstructor
@Tag(name = "Skills", description = "APIs for managing user skills")
public class SkillController {

    private final SkillService skillService;

    @GetMapping
    @Operation(summary = "Get all skills", description = "Retrieve all skills for a user")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Skills retrieved successfully"),
        @ApiResponse(responseCode = "404", description = "Profile not found")
    })
    public ResponseEntity<List<SkillDto>> getSkills(@PathVariable Long userId) {
        log.debug("GET /api/v1/profiles/{}/skills", userId);
        List<SkillDto> skills = skillService.getSkills(userId);
        return ResponseEntity.ok(skills);
    }

    @PostMapping
    @Operation(summary = "Add skill", description = "Add a new skill to user profile")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Skill added successfully"),
        @ApiResponse(responseCode = "404", description = "Profile not found"),
        @ApiResponse(responseCode = "409", description = "Skill already exists")
    })
    public ResponseEntity<SkillDto> addSkill(
            @PathVariable Long userId,
            @Valid @RequestBody SkillDto dto) {
        log.info("POST /api/v1/profiles/{}/skills", userId);
        SkillDto created = skillService.addSkill(userId, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{skillId}")
    @Operation(summary = "Update skill", description = "Update an existing skill")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Skill updated successfully"),
        @ApiResponse(responseCode = "404", description = "Skill not found")
    })
    public ResponseEntity<SkillDto> updateSkill(
            @PathVariable Long userId,
            @PathVariable Long skillId,
            @Valid @RequestBody SkillDto dto) {
        log.info("PUT /api/v1/profiles/{}/skills/{}", userId, skillId);
        SkillDto updated = skillService.updateSkill(userId, skillId, dto);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/{skillId}/endorse")
    @Operation(summary = "Endorse skill", description = "Add an endorsement to a skill")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Skill endorsed successfully"),
        @ApiResponse(responseCode = "404", description = "Skill not found")
    })
    public ResponseEntity<SkillDto> endorseSkill(
            @PathVariable Long userId,
            @PathVariable Long skillId) {
        log.info("POST /api/v1/profiles/{}/skills/{}/endorse", userId, skillId);
        SkillDto updated = skillService.endorseSkill(userId, skillId);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{skillId}/endorse")
    @Operation(summary = "Remove endorsement", description = "Remove an endorsement from a skill")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Endorsement removed successfully"),
        @ApiResponse(responseCode = "404", description = "Skill not found")
    })
    public ResponseEntity<SkillDto> removeEndorsement(
            @PathVariable Long userId,
            @PathVariable Long skillId) {
        log.warn("DELETE /api/v1/profiles/{}/skills/{}/endorse", userId, skillId);
        SkillDto updated = skillService.removeEndorsement(userId, skillId);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{skillId}")
    @Operation(summary = "Delete skill", description = "Remove a skill from user profile")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Skill deleted successfully"),
        @ApiResponse(responseCode = "404", description = "Skill not found")
    })
    public ResponseEntity<Void> deleteSkill(
            @PathVariable Long userId,
            @PathVariable Long skillId) {
        log.warn("DELETE /api/v1/profiles/{}/skills/{}", userId, skillId);
        skillService.deleteSkill(userId, skillId);
        return ResponseEntity.noContent().build();
    }
}
