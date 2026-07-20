package com.referai.profile.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

@Schema(description = "Work Experience Data Transfer Object")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkExperienceDto {

    @Schema(description = "Work experience ID", example = "1")
    private Long id;

    @Schema(description = "Company name", example = "Google")
    @NotBlank(message = "Company name is required")
    private String companyName;

    @Schema(description = "Job title", example = "Senior Software Engineer")
    @NotBlank(message = "Job title is required")
    private String jobTitle;

    @Schema(description = "Employment type", example = "FULL_TIME")
    private String employmentType;

    @Schema(description = "Start date", example = "2020-01-15")
    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    @Schema(description = "End date", example = "2023-06-30")
    private LocalDate endDate;

    @Schema(description = "Is current job", example = "true")
    @Builder.Default
    private Boolean isCurrentJob = false;

    @Schema(description = "Job description")
    private String description;

    @Schema(description = "Duration", example = "3y 5m")
    private String duration;
}
