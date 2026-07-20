package com.referai.marketplace.repository;

import com.referai.marketplace.entity.ExperienceLevel;
import com.referai.marketplace.entity.JobPosting;
import com.referai.marketplace.entity.WorkplaceType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JobPostingRepository extends JpaRepository<JobPosting, Long> {
    Optional<JobPosting> findBySlug(String slug);

    List<JobPosting> findTop6ByStatusOrderByPostedAtDesc(com.referai.marketplace.entity.JobStatus status);

    List<JobPosting> findTop8ByCompanySlugAndStatusOrderByPostedAtDesc(String companySlug, com.referai.marketplace.entity.JobStatus status);

    long countByStatus(com.referai.marketplace.entity.JobStatus status);

    @Query("""
            SELECT j FROM JobPosting j
            JOIN FETCH j.company c
            WHERE j.status = 'OPEN'
              AND (:search IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%', :search, '%'))
                OR LOWER(c.name) LIKE LOWER(CONCAT('%', :search, '%'))
                OR LOWER(j.description) LIKE LOWER(CONCAT('%', :search, '%')))
              AND (:companySlug IS NULL OR c.slug = :companySlug)
              AND (:location IS NULL OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%')))
              AND (:workplaceType IS NULL OR j.workplaceType = :workplaceType)
              AND (:experienceLevel IS NULL OR j.experienceLevel = :experienceLevel)
            """)
    Page<JobPosting> searchOpenJobs(
            @Param("search") String search,
            @Param("companySlug") String companySlug,
            @Param("location") String location,
            @Param("workplaceType") WorkplaceType workplaceType,
            @Param("experienceLevel") ExperienceLevel experienceLevel,
            Pageable pageable
    );
}
