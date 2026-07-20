package com.referai.marketplace.controller;

import com.referai.marketplace.dto.*;
import com.referai.marketplace.entity.ExperienceLevel;
import com.referai.marketplace.entity.WorkplaceType;
import com.referai.marketplace.service.MarketplaceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/marketplace")
@RequiredArgsConstructor
public class MarketplaceController {
    private final MarketplaceService marketplaceService;

    @GetMapping("/dashboard")
    public MarketplaceDashboardDto dashboard(Authentication authentication) {
        return marketplaceService.getDashboard(authentication);
    }

    @GetMapping("/jobs")
    public PageResponse<JobSummaryDto> searchJobs(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String company,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) WorkplaceType workplaceType,
            @RequestParam(required = false) ExperienceLevel experienceLevel,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication
    ) {
        Pageable pageable = PageRequest.of(page, Math.min(size, 50), Sort.by(Sort.Direction.DESC, "postedAt"));
        return marketplaceService.searchJobs(search, company, location, workplaceType, experienceLevel, pageable, authentication);
    }

    @GetMapping("/jobs/{jobId}")
    public JobDetailDto getJob(@PathVariable Long jobId, Authentication authentication) {
        return marketplaceService.getJob(jobId, authentication);
    }

    @GetMapping("/jobs/slug/{slug}")
    public JobDetailDto getJobBySlug(@PathVariable String slug, Authentication authentication) {
        return marketplaceService.getJobBySlug(slug, authentication);
    }

    @PostMapping("/jobs/{jobId}/save")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void saveJob(@PathVariable Long jobId, Authentication authentication) {
        marketplaceService.saveJob(jobId, authentication);
    }

    @DeleteMapping("/jobs/{jobId}/save")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void unsaveJob(@PathVariable Long jobId, Authentication authentication) {
        marketplaceService.unsaveJob(jobId, authentication);
    }

    @GetMapping("/saved-jobs")
    public PageResponse<JobSummaryDto> savedJobs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication
    ) {
        Pageable pageable = PageRequest.of(page, Math.min(size, 50), Sort.by(Sort.Direction.DESC, "savedAt"));
        return marketplaceService.getSavedJobs(pageable, authentication);
    }

    @PostMapping("/jobs/{jobId}/referral-requests")
    public ResponseEntity<ReferralRequestDto> requestReferral(
            @PathVariable Long jobId,
            @Valid @RequestBody ReferralRequestCreateDto createDto,
            Authentication authentication
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(marketplaceService.requestReferral(jobId, createDto, authentication));
    }

    @GetMapping("/referral-requests")
    public PageResponse<ReferralRequestDto> myReferralRequests(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication
    ) {
        Pageable pageable = PageRequest.of(page, Math.min(size, 50), Sort.by(Sort.Direction.DESC, "requestedAt"));
        return marketplaceService.getMyReferralRequests(pageable, authentication);
    }

    @PatchMapping("/referral-requests/{referralRequestId}/status")
    public ReferralRequestDto updateReferralStatus(
            @PathVariable Long referralRequestId,
            @Valid @RequestBody ReferralStatusUpdateDto updateDto,
            Authentication authentication
    ) {
        return marketplaceService.updateReferralStatus(referralRequestId, updateDto, authentication);
    }

    @GetMapping("/companies")
    public PageResponse<CompanySummaryDto> searchCompanies(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, Math.min(size, 50), Sort.by(Sort.Direction.ASC, "name"));
        return marketplaceService.searchCompanies(search, pageable);
    }

    @GetMapping("/companies/{slug}")
    public CompanyDetailDto getCompany(@PathVariable String slug) {
        return marketplaceService.getCompany(slug);
    }
}
