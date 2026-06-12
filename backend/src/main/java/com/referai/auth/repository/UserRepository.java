package com.referai.auth.repository;

import com.referai.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    @Query("SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END FROM User u WHERE u.email = ?1 AND u.deletedAt IS NULL")
    boolean existsByEmailAndNotDeleted(String email);

    @Query("SELECT u FROM User u LEFT JOIN FETCH u.roles WHERE u.email = ?1 AND u.deletedAt IS NULL")
    Optional<User> findByEmailWithRoles(String email);

    @Query("SELECT u FROM User u LEFT JOIN FETCH u.roles WHERE u.id = ?1 AND u.deletedAt IS NULL")
    Optional<User> findByIdWithRoles(Long id);
}
