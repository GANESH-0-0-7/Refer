package com.referai.profile.service;

import com.referai.profile.dto.SkillDto;
import com.referai.profile.entity.Skill;
import com.referai.profile.entity.UserProfile;
import com.referai.profile.exception.ProfileNotFoundException;
import com.referai.profile.mapper.SkillMapper;
import com.referai.profile.repository.SkillRepository;
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
public class SkillService {

    private final SkillRepository skillRepository;
    private final UserProfileRepository userProfileRepository;
    private final SkillMapper skillMapper;
    private final UserProfileService userProfileService;

    public List<SkillDto> getSkills(Long userId) {
        log.debug("Fetching skills for user ID: {}", userId);
        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> ProfileNotFoundException.forUserId(userId));
        
        return skillRepository.findByUserProfileIdOrderByEndorsementCountDesc(profile.getId())
                .stream()
                .map(skillMapper::toDto)
                .toList();
    }

    public SkillDto addSkill(Long userId, SkillDto dto) {
        log.info("Adding skill for user ID: {}", userId);
        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> ProfileNotFoundException.forUserId(userId));

        // Check if skill already exists
        var existingSkill = skillRepository.findByUserProfileIdAndSkillName(profile.getId(), dto.getSkillName());
        if (existingSkill.isPresent()) {
            throw new IllegalArgumentException("Skill already exists: " + dto.getSkillName());
        }

        Skill skill = skillMapper.toEntity(dto);
        skill.setUserProfile(profile);
        skill.setEndorsementCount(0);
        
        Skill saved = skillRepository.save(skill);
        userProfileService.updateProfileCompletion(userId);
        
        log.info("Skill added for user ID: {}", userId);
        return skillMapper.toDto(saved);
    }

    public SkillDto updateSkill(Long userId, Long skillId, SkillDto dto) {
        log.info("Updating skill {} for user ID: {}", skillId, userId);
        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> ProfileNotFoundException.forUserId(userId));

        Skill skill = skillRepository.findById(skillId)
                .orElseThrow(() -> new RuntimeException("Skill not found"));

        if (!skill.getUserProfile().getId().equals(profile.getId())) {
            throw new IllegalArgumentException("Skill does not belong to this user");
        }

        if (dto.getSkillName() != null && !dto.getSkillName().equals(skill.getSkillName())) {
            // Check for duplicate skill name
            var existingSkill = skillRepository.findByUserProfileIdAndSkillName(profile.getId(), dto.getSkillName());
            if (existingSkill.isPresent()) {
                throw new IllegalArgumentException("Skill already exists: " + dto.getSkillName());
            }
            skill.setSkillName(dto.getSkillName());
        }

        Skill updated = skillRepository.save(skill);
        log.info("Skill updated for user ID: {}", userId);
        return skillMapper.toDto(updated);
    }

    public SkillDto endorseSkill(Long userId, Long skillId) {
        log.info("Endorsing skill {} for user ID: {}", skillId, userId);
        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> ProfileNotFoundException.forUserId(userId));

        Skill skill = skillRepository.findById(skillId)
                .orElseThrow(() -> new RuntimeException("Skill not found"));

        if (!skill.getUserProfile().getId().equals(profile.getId())) {
            throw new IllegalArgumentException("Skill does not belong to this user");
        }

        skill.addEndorsement();
        Skill updated = skillRepository.save(skill);
        log.info("Skill endorsed for user ID: {}", userId);
        return skillMapper.toDto(updated);
    }

    public SkillDto removeEndorsement(Long userId, Long skillId) {
        log.info("Removing endorsement from skill {} for user ID: {}", skillId, userId);
        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> ProfileNotFoundException.forUserId(userId));

        Skill skill = skillRepository.findById(skillId)
                .orElseThrow(() -> new RuntimeException("Skill not found"));

        if (!skill.getUserProfile().getId().equals(profile.getId())) {
            throw new IllegalArgumentException("Skill does not belong to this user");
        }

        skill.removeEndorsement();
        Skill updated = skillRepository.save(skill);
        log.info("Endorsement removed from skill for user ID: {}", userId);
        return skillMapper.toDto(updated);
    }

    public void deleteSkill(Long userId, Long skillId) {
        log.warn("Deleting skill {} for user ID: {}", skillId, userId);
        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> ProfileNotFoundException.forUserId(userId));

        Skill skill = skillRepository.findById(skillId)
                .orElseThrow(() -> new RuntimeException("Skill not found"));

        if (!skill.getUserProfile().getId().equals(profile.getId())) {
            throw new IllegalArgumentException("Skill does not belong to this user");
        }

        skillRepository.delete(skill);
        userProfileService.updateProfileCompletion(userId);
        log.warn("Skill deleted for user ID: {}", userId);
    }
}
