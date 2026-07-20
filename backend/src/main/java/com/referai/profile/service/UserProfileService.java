package com.referai.profile.service;

import com.referai.profile.dto.UserProfileDto;
import com.referai.profile.entity.UserProfile;
import com.referai.profile.exception.ProfileNotFoundException;
import com.referai.profile.mapper.UserProfileMapper;
import com.referai.profile.repository.EducationRepository;
import com.referai.profile.repository.SkillRepository;
import com.referai.profile.repository.UserProfileRepository;
import com.referai.profile.repository.WorkExperienceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class UserProfileService {

    private final UserProfileRepository userProfileRepository;
    private final UserProfileMapper userProfileMapper;
    private final WorkExperienceRepository workExperienceRepository;
    private final EducationRepository educationRepository;
    private final SkillRepository skillRepository;
    private final ProfileCompletionService profileCompletionService;

    public UserProfileDto getUserProfile(Long userId) {
        log.debug("Fetching profile for user ID: {}", userId);
        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> ProfileNotFoundException.forUserId(userId));
        return enrichProfileDto(userProfileMapper.toDto(profile));
    }

    public UserProfileDto getPublicProfile(Long userId) {
        log.debug("Fetching public profile for user ID: {}", userId);
        UserProfile profile = userProfileRepository.findPublicProfileByUserId(userId)
                .orElseThrow(() -> new ProfileNotFoundException("Public profile not found for user ID: " + userId));
        return enrichProfileDto(userProfileMapper.toDto(profile));
    }

    public UserProfileDto createProfile(Long userId, UserProfileDto profileDto) {
        log.info("Creating profile for user ID: {}", userId);
        
        if (userProfileRepository.existsByUserId(userId)) {
            throw new IllegalStateException("Profile already exists for user ID: " + userId);
        }

        UserProfile profile = new UserProfile();
        profile.setUserId(userId);
        profile.setTitle(profileDto.getTitle());
        profile.setBio(profileDto.getBio());
        profile.setLocation(profileDto.getLocation());
        profile.setPhone(profileDto.getPhone());
        profile.setWebsite(profileDto.getWebsite());
        profile.setProfileVisibility(profileDto.getProfileVisibility() != null ? profileDto.getProfileVisibility() : "PUBLIC");
        profile.setProfileCompletion(0);

        UserProfile saved = userProfileRepository.save(profile);
        log.info("Profile created successfully for user ID: {}", userId);
        return enrichProfileDto(userProfileMapper.toDto(saved));
    }

    public UserProfileDto updateProfile(Long userId, UserProfileDto profileDto) {
        log.info("Updating profile for user ID: {}", userId);
        
        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> ProfileNotFoundException.forUserId(userId));

        if (profileDto.getTitle() != null) {
            profile.setTitle(profileDto.getTitle());
        }
        if (profileDto.getBio() != null) {
            profile.setBio(profileDto.getBio());
        }
        if (profileDto.getLocation() != null) {
            profile.setLocation(profileDto.getLocation());
        }
        if (profileDto.getPhone() != null) {
            profile.setPhone(profileDto.getPhone());
        }
        if (profileDto.getWebsite() != null) {
            profile.setWebsite(profileDto.getWebsite());
        }
        if (profileDto.getProfileVisibility() != null) {
            profile.setProfileVisibility(profileDto.getProfileVisibility());
        }

        UserProfile updated = userProfileRepository.save(profile);
        log.info("Profile updated successfully for user ID: {}", userId);
        return enrichProfileDto(userProfileMapper.toDto(updated));
    }

    public void updateAvatarUrl(Long userId, String avatarUrl) {
        log.debug("Updating avatar URL for user ID: {}", userId);
        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> ProfileNotFoundException.forUserId(userId));
        profile.setAvatarUrl(avatarUrl);
        userProfileRepository.save(profile);
        log.debug("Avatar URL updated for user ID: {}", userId);
    }

    public void updateProfileCompletion(Long userId) {
        log.debug("Updating profile completion percentage for user ID: {}", userId);
        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> ProfileNotFoundException.forUserId(userId));
        
        int completion = profileCompletionService.calculateCompletion(profile);
        profile.setProfileCompletion(completion);
        userProfileRepository.save(profile);
        log.debug("Profile completion updated to {}% for user ID: {}", completion, userId);
    }

    public void deleteProfile(Long userId) {
        log.warn("Deleting profile for user ID: {}", userId);
        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> ProfileNotFoundException.forUserId(userId));
        userProfileRepository.delete(profile);
        log.warn("Profile deleted for user ID: {}", userId);
    }

    private UserProfileDto enrichProfileDto(UserProfileDto dto) {
        if (dto.getId() != null) {
            dto.setWorkExperienceCount((int) workExperienceRepository.countByUserProfileId(dto.getId()));
            dto.setEducationCount((int) educationRepository.countByUserProfileId(dto.getId()));
            dto.setSkillCount((int) skillRepository.countByUserProfileId(dto.getId()));
        }
        return dto;
    }
}
