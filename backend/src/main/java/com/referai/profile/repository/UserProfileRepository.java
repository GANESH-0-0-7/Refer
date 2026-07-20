package com.referai.profile.repository;

import com.referai.profile.entity.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {

    Optional<UserProfile> findByUserId(Long userId);

    @Query("SELECT u FROM UserProfile u WHERE u.userId = :userId AND u.profileVisibility = 'PUBLIC'")
    Optional<UserProfile> findPublicProfileByUserId(@Param("userId") Long userId);

    boolean existsByUserId(Long userId);
}
