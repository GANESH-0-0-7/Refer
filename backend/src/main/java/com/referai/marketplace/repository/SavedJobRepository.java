package com.referai.marketplace.repository;

import com.referai.marketplace.entity.SavedJob;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.Set;

@Repository
public interface SavedJobRepository extends JpaRepository<SavedJob, Long> {
    boolean existsByUserIdAndJobId(Long userId, Long jobId);

    Optional<SavedJob> findByUserIdAndJobId(Long userId, Long jobId);

    Page<SavedJob> findByUserIdOrderBySavedAtDesc(Long userId, Pageable pageable);

    long countByUserId(Long userId);

    Set<SavedJob> findByUserIdAndJobIdIn(Long userId, Set<Long> jobIds);
}
