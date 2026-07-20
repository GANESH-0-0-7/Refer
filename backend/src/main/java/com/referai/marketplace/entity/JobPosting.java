package com.referai.marketplace.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "job_postings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobPosting {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Column(nullable = false, length = 220)
    private String title;

    @Column(nullable = false, unique = true, length = 260)
    private String slug;

    @Column(nullable = false, length = 180)
    private String location;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private WorkplaceType workplaceType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private EmploymentType employmentType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private ExperienceLevel experienceLevel;

    private Integer minSalary;
    private Integer maxSalary;

    @Builder.Default
    @Column(nullable = false, length = 10)
    private String currency = "USD";

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String requirements;

    @Column(columnDefinition = "TEXT")
    private String applyUrl;

    private Integer referralBonus;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private JobStatus status = JobStatus.OPEN;

    @Builder.Default
    @Column(nullable = false)
    private LocalDateTime postedAt = LocalDateTime.now();

    private LocalDateTime expiresAt;

    @Builder.Default
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Builder.Default
    @Column(nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();
}
