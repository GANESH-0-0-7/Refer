package com.referai.profile.repository;

import com.referai.profile.entity.Education;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EducationRepository extends JpaRepository<Education, Long> {

    List<Education> findByUserProfileId(Long userProfileId);

    @Query("SELECT e FROM Education e WHERE e.userProfile.id = :profileId ORDER BY e.endDate DESC")
    List<Education> findByUserProfileIdOrderByEndDateDesc(@Param("profileId") Long profileId);

    long countByUserProfileId(Long userProfileId);
}
