package com.referai.profile.repository;

import com.referai.profile.entity.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SkillRepository extends JpaRepository<Skill, Long> {

    List<Skill> findByUserProfileId(Long userProfileId);

    @Query("SELECT s FROM Skill s WHERE s.userProfile.id = :profileId ORDER BY s.endorsementCount DESC")
    List<Skill> findByUserProfileIdOrderByEndorsementCountDesc(@Param("profileId") Long profileId);

    @Query("SELECT s FROM Skill s WHERE s.userProfile.id = :profileId AND s.skillName = :skillName")
    Optional<Skill> findByUserProfileIdAndSkillName(@Param("profileId") Long profileId, @Param("skillName") String skillName);

    long countByUserProfileId(Long userProfileId);
}
