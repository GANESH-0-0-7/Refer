package com.referai.profile.service;

import com.referai.profile.dto.EducationDto;
import com.referai.profile.entity.Education;
import com.referai.profile.entity.UserProfile;
import com.referai.profile.exception.ProfileNotFoundException;
import com.referai.profile.mapper.EducationMapper;
import com.referai.profile.repository.EducationRepository;
import com.referai.profile.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class EducationService {

    private final EducationRepository educationRepository;
    private final UserProfileRepository userProfileRepository;
    private final EducationMapper educationMapper;
    private final UserProfileService userProfileService;

    public List<EducationDto> getEducations(Long userId) {
        log.debug("Fetching educations for user ID: {}", userId);
        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> ProfileNotFoundException.forUserId(userId));
        
        return educationRepository.findByUserProfileIdOrderByEndDateDesc(profile.getId())
                .stream()
                .map(educationMapper::toDto)
                .toList();
    }

    public EducationDto addEducation(Long userId, EducationDto dto) {
        log.info("Adding education for user ID: {}", userId);
        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> ProfileNotFoundException.forUserId(userId));

        Education education = educationMapper.toEntity(dto);
        education.setUserProfile(profile);
        
        Education saved = educationRepository.save(education);
        userProfileService.updateProfileCompletion(userId);
        
        log.info("Education added for user ID: {}", userId);
        return educationMapper.toDto(saved);
    }

    public EducationDto updateEducation(Long userId, Long educationId, EducationDto dto) {
        log.info("Updating education {} for user ID: {}", educationId, userId);
        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> ProfileNotFoundException.forUserId(userId));

        Education education = educationRepository.findById(educationId)
                .orElseThrow(() -> new RuntimeException("Education not found"));

        if (!education.getUserProfile().getId().equals(profile.getId())) {
            throw new IllegalArgumentException("Education does not belong to this user");
        }

        if (dto.getSchoolName() != null) education.setSchoolName(dto.getSchoolName());
        if (dto.getDegree() != null) education.setDegree(dto.getDegree());
        if (dto.getFieldOfStudy() != null) education.setFieldOfStudy(dto.getFieldOfStudy());
        if (dto.getStartDate() != null) education.setStartDate(dto.getStartDate());
        if (dto.getEndDate() != null) education.setEndDate(dto.getEndDate());
        if (dto.getGrade() != null) education.setGrade(dto.getGrade());
        if (dto.getActivities() != null) education.setActivities(dto.getActivities());

        Education updated = educationRepository.save(education);
        log.info("Education updated for user ID: {}", userId);
        return educationMapper.toDto(updated);
    }

    public void deleteEducation(Long userId, Long educationId) {
        log.warn("Deleting education {} for user ID: {}", educationId, userId);
        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> ProfileNotFoundException.forUserId(userId));

        Education education = educationRepository.findById(educationId)
                .orElseThrow(() -> new RuntimeException("Education not found"));

        if (!education.getUserProfile().getId().equals(profile.getId())) {
            throw new IllegalArgumentException("Education does not belong to this user");
        }

        educationRepository.delete(education);
        userProfileService.updateProfileCompletion(userId);
        log.warn("Education deleted for user ID: {}", userId);
    }
}
