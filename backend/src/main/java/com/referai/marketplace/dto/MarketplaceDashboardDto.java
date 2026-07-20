package com.referai.marketplace.dto;

import java.util.List;

public record MarketplaceDashboardDto(
        long openJobs,
        long savedJobs,
        long referralRequests,
        long referredRequests,
        List<ReferralRequestDto> recentReferrals,
        List<JobSummaryDto> recommendedJobs
) {
}
