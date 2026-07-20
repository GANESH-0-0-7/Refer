package com.referai.marketplace.service;

import com.referai.auth.entity.User;
import com.referai.auth.repository.UserRepository;
import com.referai.common.exception.BusinessException;
import com.referai.common.exception.ResourceNotFoundException;
import com.referai.marketplace.dto.*;
import com.referai.marketplace.entity.*;
import com.referai.marketplace.repository.CompanyRepository;
import com.referai.marketplace.repository.JobPostingRepository;
import com.referai.marketplace.repository.ReferralRequestRepository;
import com.referai.marketplace.repository.SavedJobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MarketplaceService {
    private final CompanyRepository companyRepository;
    private final JobPostingRepository jobPostingRepository;
    private final SavedJobRepository savedJobRepository;
    private final ReferralRequestRepository referralRequestRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public MarketplaceDashboardDto getDashboard(Authentication authentication) {
        User user = currentUser(authentication);
        Set<Long> recommendedJobIds = jobPostingRepository
                .findTop6ByStatusOrderByPostedAtDesc(JobStatus.OPEN)
                .stream()
                .map(JobPosting::getId)
                .collect(Collectors.toSet());

        Set<Long> savedJobIds = savedJobIds(user.getId(), recommendedJobIds);
        Set<Long> requestedJobIds = requestedJobIds(user.getId(), recommendedJobIds);

        return new MarketplaceDashboardDto(
                jobPostingRepository.countByStatus(JobStatus.OPEN),
                savedJobRepository.countByUserId(user.getId()),
                referralRequestRepository.countByRequesterId(user.getId()),
                referralRequestRepository.countByRequesterIdAndStatus(user.getId(), ReferralStatus.REFERRED),
                referralRequestRepository.findTop5ByRequesterIdOrderByRequestedAtDesc(user.getId())
                        .stream()
                        .map(request -> toReferralRequestDto(request, user.getId()))
                        .toList(),
                jobPostingRepository.findTop6ByStatusOrderByPostedAtDesc(JobStatus.OPEN)
                        .stream()
                        .map(job -> toJobSummaryDto(job, savedJobIds.contains(job.getId()), requestedJobIds.contains(job.getId())))
                        .toList()
        );
    }

    @Transactional(readOnly = true)
    public PageResponse<JobSummaryDto> searchJobs(String search, String companySlug, String location, WorkplaceType workplaceType, ExperienceLevel experienceLevel, Pageable pageable, Authentication authentication) {
        Long userId = currentUser(authentication).getId();
        Page<JobPosting> jobs = jobPostingRepository.searchOpenJobs(clean(search), clean(companySlug), clean(location), workplaceType, experienceLevel, pageable);
        Set<Long> jobIds = jobs.stream().map(JobPosting::getId).collect(Collectors.toSet());
        Set<Long> savedJobIds = savedJobIds(userId, jobIds);
        Set<Long> requestedJobIds = requestedJobIds(userId, jobIds);

        Page<JobSummaryDto> dtoPage = jobs.map(job -> toJobSummaryDto(job, savedJobIds.contains(job.getId()), requestedJobIds.contains(job.getId())));
        return PageResponse.from(dtoPage);
    }

    @Transactional(readOnly = true)
    public JobDetailDto getJob(Long jobId, Authentication authentication) {
        Long userId = currentUser(authentication).getId();
        JobPosting job = jobPostingRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));
        return toJobDetailDto(
                job,
                savedJobRepository.existsByUserIdAndJobId(userId, job.getId()),
                referralRequestRepository.existsByRequesterIdAndJobId(userId, job.getId())
        );
    }

    @Transactional(readOnly = true)
    public JobDetailDto getJobBySlug(String slug, Authentication authentication) {
        Long userId = currentUser(authentication).getId();
        JobPosting job = jobPostingRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));
        return toJobDetailDto(
                job,
                savedJobRepository.existsByUserIdAndJobId(userId, job.getId()),
                referralRequestRepository.existsByRequesterIdAndJobId(userId, job.getId())
        );
    }

    @Transactional(readOnly = true)
    public PageResponse<CompanySummaryDto> searchCompanies(String search, Pageable pageable) {
        return PageResponse.from(companyRepository.search(clean(search), pageable).map(this::toCompanySummaryDto));
    }

    @Transactional(readOnly = true)
    public CompanyDetailDto getCompany(String slug) {
        Company company = companyRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found"));
        return new CompanyDetailDto(
                company.getId(),
                company.getName(),
                company.getSlug(),
                company.getLogoUrl(),
                company.getWebsiteUrl(),
                company.getIndustry(),
                company.getHeadquarters(),
                company.getCompanySize(),
                company.getDescription(),
                company.getOpenRolesCount(),
                company.getReferralSuccessRate(),
                jobPostingRepository.findTop8ByCompanySlugAndStatusOrderByPostedAtDesc(company.getSlug(), JobStatus.OPEN)
                        .stream()
                        .map(job -> toJobSummaryDto(job, false, false))
                        .toList()
        );
    }

    @Transactional
    public void saveJob(Long jobId, Authentication authentication) {
        User user = currentUser(authentication);
        JobPosting job = jobPostingRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        if (!savedJobRepository.existsByUserIdAndJobId(user.getId(), jobId)) {
            savedJobRepository.save(SavedJob.builder().user(user).job(job).build());
        }
    }

    @Transactional
    public void unsaveJob(Long jobId, Authentication authentication) {
        Long userId = currentUser(authentication).getId();
        savedJobRepository.findByUserIdAndJobId(userId, jobId).ifPresent(savedJobRepository::delete);
    }

    @Transactional(readOnly = true)
    public PageResponse<JobSummaryDto> getSavedJobs(Pageable pageable, Authentication authentication) {
        Long userId = currentUser(authentication).getId();
        Page<SavedJob> savedJobs = savedJobRepository.findByUserIdOrderBySavedAtDesc(userId, pageable);
        Page<JobSummaryDto> dtoPage = new PageImpl<>(
                savedJobs.stream()
                        .map(savedJob -> toJobSummaryDto(savedJob.getJob(), true, referralRequestRepository.existsByRequesterIdAndJobId(userId, savedJob.getJob().getId())))
                        .toList(),
                pageable,
                savedJobs.getTotalElements()
        );
        return PageResponse.from(dtoPage);
    }

    @Transactional
    public ReferralRequestDto requestReferral(Long jobId, ReferralRequestCreateDto createDto, Authentication authentication) {
        User user = currentUser(authentication);
        JobPosting job = jobPostingRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        if (job.getStatus() != JobStatus.OPEN) {
            throw new BusinessException("Referral requests are only available for open jobs");
        }

        if (referralRequestRepository.existsByRequesterIdAndJobId(user.getId(), jobId)) {
            throw new BusinessException("A referral request already exists for this job");
        }

        ReferralRequest request = ReferralRequest.builder()
                .requester(user)
                .job(job)
                .status(ReferralStatus.REQUESTED)
                .message(createDto.message())
                .resumeUrl(createDto.resumeUrl())
                .linkedinUrl(createDto.linkedinUrl())
                .portfolioUrl(createDto.portfolioUrl())
                .build();

        return toReferralRequestDto(referralRequestRepository.save(request), user.getId());
    }

    @Transactional(readOnly = true)
    public PageResponse<ReferralRequestDto> getMyReferralRequests(Pageable pageable, Authentication authentication) {
        Long userId = currentUser(authentication).getId();
        return PageResponse.from(referralRequestRepository.findByRequesterIdOrderByRequestedAtDesc(userId, pageable)
                .map(request -> toReferralRequestDto(request, userId)));
    }

    @Transactional
    public ReferralRequestDto updateReferralStatus(Long referralRequestId, ReferralStatusUpdateDto updateDto, Authentication authentication) {
        Long userId = currentUser(authentication).getId();
        ReferralRequest request = referralRequestRepository.findById(referralRequestId)
                .orElseThrow(() -> new ResourceNotFoundException("Referral request not found"));

        if (!request.getRequester().getId().equals(userId)) {
            throw new BusinessException("You can only update your own referral request");
        }

        request.setStatus(updateDto.status());
        request.setRejectionReason(updateDto.rejectionReason());
        request.setUpdatedAt(LocalDateTime.now());

        return toReferralRequestDto(referralRequestRepository.save(request), userId);
    }

    private User currentUser(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            throw new BusinessException("Authenticated user is required");
        }

        return userRepository.findByEmailWithRoles(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));
    }

    private String clean(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }

    private Set<Long> savedJobIds(Long userId, Set<Long> jobIds) {
        if (jobIds.isEmpty()) {
            return Collections.emptySet();
        }
        return savedJobRepository.findByUserIdAndJobIdIn(userId, jobIds)
                .stream()
                .map(savedJob -> savedJob.getJob().getId())
                .collect(Collectors.toSet());
    }

    private Set<Long> requestedJobIds(Long userId, Set<Long> jobIds) {
        if (jobIds.isEmpty()) {
            return Collections.emptySet();
        }
        return referralRequestRepository.findByRequesterIdAndJobIdIn(userId, jobIds)
                .stream()
                .map(request -> request.getJob().getId())
                .collect(Collectors.toSet());
    }

    private CompanySummaryDto toCompanySummaryDto(Company company) {
        return new CompanySummaryDto(
                company.getId(),
                company.getName(),
                company.getSlug(),
                company.getLogoUrl(),
                company.getIndustry(),
                company.getHeadquarters(),
                company.getCompanySize(),
                company.getOpenRolesCount(),
                company.getReferralSuccessRate()
        );
    }

    private JobSummaryDto toJobSummaryDto(JobPosting job, boolean saved, boolean referralRequested) {
        return new JobSummaryDto(
                job.getId(),
                job.getTitle(),
                job.getSlug(),
                toCompanySummaryDto(job.getCompany()),
                job.getLocation(),
                job.getWorkplaceType(),
                job.getEmploymentType(),
                job.getExperienceLevel(),
                job.getMinSalary(),
                job.getMaxSalary(),
                job.getCurrency(),
                job.getReferralBonus(),
                job.getStatus(),
                job.getPostedAt(),
                saved,
                referralRequested
        );
    }

    private JobDetailDto toJobDetailDto(JobPosting job, boolean saved, boolean referralRequested) {
        return new JobDetailDto(
                job.getId(),
                job.getTitle(),
                job.getSlug(),
                toCompanySummaryDto(job.getCompany()),
                job.getLocation(),
                job.getWorkplaceType(),
                job.getEmploymentType(),
                job.getExperienceLevel(),
                job.getMinSalary(),
                job.getMaxSalary(),
                job.getCurrency(),
                job.getDescription(),
                job.getRequirements(),
                job.getApplyUrl(),
                job.getReferralBonus(),
                job.getStatus(),
                job.getPostedAt(),
                job.getExpiresAt(),
                saved,
                referralRequested
        );
    }

    private ReferralRequestDto toReferralRequestDto(ReferralRequest request, Long currentUserId) {
        User requester = request.getRequester();
        User referrer = request.getReferrer();

        return new ReferralRequestDto(
                request.getId(),
                toJobSummaryDto(
                        request.getJob(),
                        savedJobRepository.existsByUserIdAndJobId(currentUserId, request.getJob().getId()),
                        true
                ),
                requester.getId(),
                requester.getFullName(),
                requester.getEmail(),
                referrer != null ? referrer.getId() : null,
                referrer != null ? referrer.getFullName() : null,
                request.getStatus(),
                request.getMessage(),
                request.getResumeUrl(),
                request.getLinkedinUrl(),
                request.getPortfolioUrl(),
                request.getRejectionReason(),
                request.getRequestedAt(),
                request.getUpdatedAt()
        );
    }
}
