package com.referai.profile.repository;

import com.referai.profile.entity.WorkExperience;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkExperienceRepository extends JpaRepository<WorkExperience, Long> {

    List<WorkExperience> findByUserProfileId(Long userProfileId);

    @Query("SELECT we FROM WorkExperience we WHERE we.userProfile.id = :profileId ORDER BY we.startDate DESC")
    List<WorkExperience> findByUserProfileIdOrderByStartDateDesc(@Param("profileId") Long profileId);

    long countByUserProfileId(Long userProfileId);
}
