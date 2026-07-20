package com.referai.marketplace.dto;

import com.referai.marketplace.entity.EmploymentType;
import com.referai.marketplace.entity.ExperienceLevel;
import com.referai.marketplace.entity.JobStatus;
import com.referai.marketplace.entity.WorkplaceType;

import java.time.LocalDateTime;

public record JobSummaryDto(
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
        Integer referralBonus,
        JobStatus status,
        LocalDateTime postedAt,
        boolean saved,
        boolean referralRequested
) {
}
