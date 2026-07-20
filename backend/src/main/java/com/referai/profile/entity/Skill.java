package com.referai.profile.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "skills", indexes = {
        @Index(name = "idx_skills_user_profile_id", columnList = "user_profile_id"),
        @Index(name = "idx_skills_skill_name", columnList = "skill_name")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_profile_id", nullable = false)
    private UserProfile userProfile;

    @Column(nullable = false, length = 100, unique = false)
    private String skillName;

    @Column(nullable = false)
    @Builder.Default
    private Integer endorsementCount = 0;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public void addEndorsement() {
        this.endorsementCount++;
    }

    public void removeEndorsement() {
        if (this.endorsementCount > 0) {
            this.endorsementCount--;
        }
    }
}
