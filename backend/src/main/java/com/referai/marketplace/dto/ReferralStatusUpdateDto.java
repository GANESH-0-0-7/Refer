package com.referai.marketplace.dto;

import com.referai.marketplace.entity.ReferralStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ReferralStatusUpdateDto(
        @NotNull(message = "Status is required")
        ReferralStatus status,

        @Size(max = 1000, message = "Rejection reason cannot exceed 1000 characters")
        String rejectionReason
) {
}
