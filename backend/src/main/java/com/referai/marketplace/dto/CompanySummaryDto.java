package com.referai.marketplace.dto;

import java.math.BigDecimal;

public record CompanySummaryDto(
        Long id,
        String name,
        String slug,
        String logoUrl,
        String industry,
        String headquarters,
        String companySize,
        Integer openRolesCount,
        BigDecimal referralSuccessRate
) {
}
