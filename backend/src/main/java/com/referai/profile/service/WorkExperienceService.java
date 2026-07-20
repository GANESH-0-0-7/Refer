package com.referai.profile.service;

import com.referai.profile.dto.WorkExperienceDto;
import com.referai.profile.entity.UserProfile;
import com.referai.profile.entity.WorkExperience;
import com.referai.profile.exception.ProfileNotFoundException;
import com.referai.profile.mapper.WorkExperienceMapper;
import com.referai.profile.repository.UserProfileRepository;
import com.referai.profile.repository.WorkExperienceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class WorkExperienceService {

    private final WorkExperienceRepository workExperienceRepository;
    private final UserProfileRepository userProfileRepository;
    private final WorkExperienceMapper workExperienceMapper;
    private final UserProfileService userProfileService;

    public List<WorkExperienceDto> getWorkExperiences(Long userId) {
        log.debug("Fetching work experiences for user ID: {}", userId);
        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> ProfileNotFoundException.forUserId(userId));
        
        return workExperienceRepository.findByUserProfileIdOrderByStartDateDesc(profile.getId())
                .stream()
                .map(workExperienceMapper::toDto)
                .toList();
    }

    public WorkExperienceDto addWorkExperience(Long userId, WorkExperienceDto dto) {
        log.info("Adding work experience for user ID: {}", userId);
        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> ProfileNotFoundException.forUserId(userId));

        WorkExperience experience = workExperienceMapper.toEntity(dto);
        experience.setUserProfile(profile);
        
        WorkExperience saved = workExperienceRepository.save(experience);
        userProfileService.updateProfileCompletion(userId);
        
        log.info("Work experience added for user ID: {}", userId);
        return workExperienceMapper.toDto(saved);
    }

    public WorkExperienceDto updateWorkExperience(Long userId, Long experienceId, WorkExperienceDto dto) {
        log.info("Updating work experience {} for user ID: {}", experienceId, userId);
        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> ProfileNotFoundException.forUserId(userId));

        WorkExperience experience = workExperienceRepository.findById(experienceId)
                .orElseThrow(() -> new RuntimeException("Work experience not found"));

        if (!experience.getUserProfile().getId().equals(profile.getId())) {
            throw new IllegalArgumentException("Work experience does not belong to this user");
        }

        if (dto.getCompanyName() != null) experience.setCompanyName(dto.getCompanyName());
        if (dto.getJobTitle() != null) experience.setJobTitle(dto.getJobTitle());
        if (dto.getEmploymentType() != null) experience.setEmploymentType(dto.getEmploymentType());
        if (dto.getStartDate() != null) experience.setStartDate(dto.getStartDate());
        if (dto.getEndDate() != null) experience.setEndDate(dto.getEndDate());
        if (dto.getIsCurrentJob() != null) experience.setIsCurrentJob(dto.getIsCurrentJob());
        if (dto.getDescription() != null) experience.setDescription(dto.getDescription());

        WorkExperience updated = workExperienceRepository.save(experience);
        log.info("Work experience updated for user ID: {}", userId);
        return workExperienceMapper.toDto(updated);
    }

    public void deleteWorkExperience(Long userId, Long experienceId) {
        log.warn("Deleting work experience {} for user ID: {}", experienceId, userId);
        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> ProfileNotFoundException.forUserId(userId));

        WorkExperience experience = workExperienceRepository.findById(experienceId)
                .orElseThrow(() -> new RuntimeException("Work experience not found"));

        if (!experience.getUserProfile().getId().equals(profile.getId())) {
            throw new IllegalArgumentException("Work experience does not belong to this user");
        }

        workExperienceRepository.delete(experience);
        userProfileService.updateProfileCompletion(userId);
        log.warn("Work experience deleted for user ID: {}", userId);
    }
}
