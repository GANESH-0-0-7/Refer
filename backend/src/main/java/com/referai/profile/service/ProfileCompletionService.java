package com.referai.profile.service;

import com.referai.profile.entity.UserProfile;
import com.referai.profile.repository.EducationRepository;
import com.referai.profile.repository.SkillRepository;
import com.referai.profile.repository.WorkExperienceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProfileCompletionService {

    private final WorkExperienceRepository workExperienceRepository;
    private final EducationRepository educationRepository;
    private final SkillRepository skillRepository;

    public int calculateCompletion(UserProfile profile) {
        int completion = 0;
        
        // Basic info: title + bio + location = 20%
        int basicInfoFields = 0;
        if (profile.getTitle() != null && !profile.getTitle().isBlank()) basicInfoFields++;
        if (profile.getBio() != null && !profile.getBio().isBlank()) basicInfoFields++;
        if (profile.getLocation() != null && !profile.getLocation().isBlank()) basicInfoFields++;
        
        if (basicInfoFields >= 2) {
            completion += 20;
        }
        
        // Avatar: 15%
        if (profile.getAvatarUrl() != null && !profile.getAvatarUrl().isBlank()) {
            completion += 15;
        }
        
        // Work Experience: 20%
        if (workExperienceRepository.countByUserProfileId(profile.getId()) > 0) {
            completion += 20;
        }
        
        // Education: 20%
        if (educationRepository.countByUserProfileId(profile.getId()) > 0) {
            completion += 20;
        }
        
        // Skills: 25%
        if (skillRepository.countByUserProfileId(profile.getId()) >= 3) {
            completion += 25;
        } else if (skillRepository.countByUserProfileId(profile.getId()) > 0) {
            completion += 12;
        }
        
        log.debug("Profile completion calculated: {}%", Math.min(completion, 100));
        return Math.min(completion, 100);
    }
}
