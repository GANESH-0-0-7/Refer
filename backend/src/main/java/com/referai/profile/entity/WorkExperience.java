package com.referai.profile.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "work_experiences", indexes = {
        @Index(name = "idx_work_exp_user_profile_id", columnList = "user_profile_id"),
        @Index(name = "idx_work_exp_is_current", columnList = "is_current_job")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkExperience {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_profile_id", nullable = false)
    private UserProfile userProfile;

    @Column(nullable = false, length = 100)
    private String companyName;

    @Column(nullable = false, length = 100)
    private String jobTitle;

    @Column(length = 50)
    private String employmentType;

    @Column(nullable = false)
    private LocalDate startDate;

    @Column
    private LocalDate endDate;

    @Column(name = "is_current_job", nullable = false)
    @Builder.Default
    private Boolean isCurrentJob = false;

    @Column(columnDefinition = "TEXT")
    private String description;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public String getDuration() {
        if (startDate == null) return "";
        
        LocalDate end = isCurrentJob ? LocalDate.now() : (endDate != null ? endDate : LocalDate.now());
        long months = java.time.temporal.ChronoUnit.MONTHS.between(startDate, end);
        long years = months / 12;
        long remainingMonths = months % 12;
        
        if (years > 0 && remainingMonths > 0) {
            return years + "y " + remainingMonths + "m";
        } else if (years > 0) {
            return years + " year" + (years > 1 ? "s" : "");
        } else {
            return remainingMonths + " month" + (remainingMonths > 1 ? "s" : "");
        }
    }
}
