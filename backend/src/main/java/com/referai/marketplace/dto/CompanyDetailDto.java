package com.referai.marketplace.dto;

import java.math.BigDecimal;
import java.util.List;

public record CompanyDetailDto(
        Long id,
        String name,
        String slug,
        String logoUrl,
        String websiteUrl,
        String industry,
        String headquarters,
        String companySize,
        String description,
        Integer openRolesCount,
        BigDecimal referralSuccessRate,
        List<JobSummaryDto> openJobs
) {
}
