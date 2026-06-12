package com.referai.auth.repository;

import com.referai.auth.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);

    @Query("SELECT rt FROM RefreshToken rt WHERE rt.token = ?1 AND rt.revoked = false AND rt.expiresAt > CURRENT_TIMESTAMP")
    Optional<RefreshToken> findValidToken(String token);

    void deleteByUserId(Long userId);
}
