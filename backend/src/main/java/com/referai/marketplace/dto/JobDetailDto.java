package com.referai.marketplace.dto;

import com.referai.marketplace.entity.EmploymentType;
import com.referai.marketplace.entity.ExperienceLevel;
import com.referai.marketplace.entity.JobStatus;
import com.referai.marketplace.entity.WorkplaceType;

import java.time.LocalDateTime;

public record JobDetailDto(
        Long id,
        String title,
        String slug,
        CompanySummaryDto company,
        String location,
        WorkplaceType workplaceType,
        EmploymentType employmentType,
        ExperienceLevel experienceLevel,
        Integer minSalary,
        Integer maxSalary,
        String currency,
        String description,
        String requirements,
        String applyUrl,
        Integer referralBonus,
        JobStatus status,
        LocalDateTime postedAt,
        LocalDateTime expiresAt,
        boolean saved,
        boolean referralRequested
) {
}
