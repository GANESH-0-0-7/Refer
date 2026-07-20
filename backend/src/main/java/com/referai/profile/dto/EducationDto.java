package com.referai.profile.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDate;

@Schema(description = "Education Data Transfer Object")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EducationDto {

    @Schema(description = "Education ID", example = "1")
    private Long id;

    @Schema(description = "School name", example = "Stanford University")
    @NotBlank(message = "School name is required")
    private String schoolName;

    @Schema(description = "Degree", example = "Bachelor of Science")
    @NotBlank(message = "Degree is required")
    private String degree;

    @Schema(description = "Field of study", example = "Computer Science")
    private String fieldOfStudy;

    @Schema(description = "Start date", example = "2016-09-01")
    private LocalDate startDate;

    @Schema(description = "End date", example = "2020-05-30")
    private LocalDate endDate;

    @Schema(description = "Grade", example = "3.8")
    private String grade;

    @Schema(description = "Activities and societies")
    private String activities;
}
