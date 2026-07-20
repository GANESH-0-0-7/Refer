package com.referai.profile.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
        name = "user_profiles",
        indexes = {
                @Index(name = "idx_user_profiles_user_id", columnList = "user_id"),
                @Index(name = "idx_user_profiles_visibility", columnList = "profile_visibility")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    @Column(length = 100)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(length = 100)
    private String location;

    @Column(length = 20)
    private String phone;

    @Column(length = 500)
    private String website;

    @Column(name = "avatar_url", length = 500)
    private String avatarUrl;

    @Column(name = "profile_visibility", nullable = false, length = 20)
    @Builder.Default
    private String profileVisibility = "PUBLIC";

    @Column(name = "profile_completion", nullable = false)
    @Builder.Default
    private Integer profileCompletion = 0;

    @OneToMany(
            mappedBy = "userProfile",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    @Builder.Default
    private List<WorkExperience> workExperiences = new ArrayList<>();

    @OneToMany(
            mappedBy = "userProfile",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    @Builder.Default
    private List<Education> educations = new ArrayList<>();

    @OneToMany(
            mappedBy = "userProfile",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    @Builder.Default
    private List<Skill> skills = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public void addWorkExperience(WorkExperience experience) {
        workExperiences.add(experience);
        experience.setUserProfile(this);
    }

    public void removeWorkExperience(WorkExperience experience) {
        workExperiences.remove(experience);
        experience.setUserProfile(null);
    }

    public void addEducation(Education education) {
        educations.add(education);
        education.setUserProfile(this);
    }

    public void removeEducation(Education education) {
        educations.remove(education);
        education.setUserProfile(null);
    }

    public void addSkill(Skill skill) {
        skills.add(skill);
        skill.setUserProfile(this);
    }

    public void removeSkill(Skill skill) {
        skills.remove(skill);
        skill.setUserProfile(null);
    }
}