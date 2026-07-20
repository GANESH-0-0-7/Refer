package com.referai.profile.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Schema(description = "Skill Data Transfer Object")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SkillDto {

    @Schema(description = "Skill ID", example = "1")
    private Long id;

    @Schema(description = "Skill name", example = "Java")
    @NotBlank(message = "Skill name is required")
    private String skillName;

    @Schema(description = "Endorsement count", example = "15")
    @Builder.Default
    private Integer endorsementCount = 0;
}
