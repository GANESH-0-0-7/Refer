package com.referai.marketplace.repository;

import com.referai.marketplace.entity.ReferralRequest;
import com.referai.marketplace.entity.ReferralStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface ReferralRequestRepository extends JpaRepository<ReferralRequest, Long> {
    boolean existsByRequesterIdAndJobId(Long requesterId, Long jobId);

    Optional<ReferralRequest> findByRequesterIdAndJobId(Long requesterId, Long jobId);

    Page<ReferralRequest> findByRequesterIdOrderByRequestedAtDesc(Long requesterId, Pageable pageable);

    List<ReferralRequest> findTop5ByRequesterIdOrderByRequestedAtDesc(Long requesterId);

    long countByRequesterId(Long requesterId);

    long countByRequesterIdAndStatus(Long requesterId, ReferralStatus status);

    Set<ReferralRequest> findByRequesterIdAndJobIdIn(Long requesterId, Set<Long> jobIds);
}
