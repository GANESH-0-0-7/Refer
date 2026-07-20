package com.referai.marketplace.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ReferralRequestCreateDto(
        @NotBlank(message = "Message is required")
        @Size(min = 20, max = 2000, message = "Message must be between 20 and 2000 characters")
        String message,

        @Size(max = 1000, message = "Resume URL cannot exceed 1000 characters")
        String resumeUrl,

        @Size(max = 1000, message = "LinkedIn URL cannot exceed 1000 characters")
        String linkedinUrl,

        @Size(max = 1000, message = "Portfolio URL cannot exceed 1000 characters")
        String portfolioUrl
) {
}
