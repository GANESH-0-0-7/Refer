package com.referai.profile.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;

@Schema(description = "User Profile Data Transfer Object")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfileDto {

    @Schema(description = "Profile ID", example = "1")
    private Long id;

    @Schema(description = "User ID", example = "1")
    private Long userId;

    @Schema(description = "Professional title", example = "Senior Software Engineer")
    @Size(max = 100, message = "Title must not exceed 100 characters")
    private String title;

    @Schema(description = "Professional bio", example = "Passionate developer with 5 years of experience in Java and Spring Boot")
    @Size(max = 5000, message = "Bio must not exceed 5000 characters")
    private String bio;

    @Schema(description = "Location", example = "San Francisco, CA")
    @Size(max = 100, message = "Location must not exceed 100 characters")
    private String location;

    @Schema(description = "Phone number", example = "+1-555-0123")
    @Pattern(regexp = "^[+]?[0-9\\-\\s()]*$", message = "Phone number format is invalid")
    private String phone;

    @Schema(description = "Website or portfolio URL", example = "https://portfolio.example.com")
    @Size(max = 500, message = "Website URL must not exceed 500 characters")
    private String website;

    @Schema(description = "Avatar URL")
    private String avatarUrl;

    @Schema(description = "Profile visibility: PUBLIC or PRIVATE", example = "PUBLIC")
    private String profileVisibility;

    @Schema(description = "Profile completion percentage", example = "65")
    private Integer profileCompletion;

    @Schema(description = "Number of work experiences")
    private Integer workExperienceCount;

    @Schema(description = "Number of educations")
    private Integer educationCount;

    @Schema(description = "Number of skills")
    private Integer skillCount;

    public UserProfileDto(Long id, Long userId, String title, String bio, String location, 
                         String phone, String website, String avatarUrl, String profileVisibility, 
                         Integer profileCompletion) {
        this.id = id;
        this.userId = userId;
        this.title = title;
        this.bio = bio;
        this.location = location;
        this.phone = phone;
        this.website = website;
        this.avatarUrl = avatarUrl;
        this.profileVisibility = profileVisibility;
        this.profileCompletion = profileCompletion;
    }
}
