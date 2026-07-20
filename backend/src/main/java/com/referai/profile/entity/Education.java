package com.referai.profile.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "educations", indexes = {
        @Index(name = "idx_education_user_profile_id", columnList = "user_profile_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Education {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_profile_id", nullable = false)
    private UserProfile userProfile;

    @Column(nullable = false, length = 200)
    private String schoolName;

    @Column(nullable = false, length = 100)
    private String degree;

    @Column(length = 100)
    private String fieldOfStudy;

    @Column
    private LocalDate startDate;

    @Column
    private LocalDate endDate;

    @Column(length = 10)
    private String grade;

    @Column(columnDefinition = "TEXT")
    private String activities;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
