package com.referai.marketplace.dto;

import com.referai.marketplace.entity.ReferralStatus;

import java.time.LocalDateTime;

public record ReferralRequestDto(
        Long id,
        JobSummaryDto job,
        Long requesterId,
        String requesterName,
        String requesterEmail,
        Long referrerId,
        String referrerName,
        ReferralStatus status,
        String message,
        String resumeUrl,
        String linkedinUrl,
        String portfolioUrl,
        String rejectionReason,
        LocalDateTime requestedAt,
        LocalDateTime updatedAt
) {
}
