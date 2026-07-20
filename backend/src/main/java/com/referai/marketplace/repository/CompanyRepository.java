package com.referai.marketplace.repository;

import com.referai.marketplace.entity.Company;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {
    Optional<Company> findBySlug(String slug);

    @Query("""
            SELECT c FROM Company c
            WHERE (:search IS NULL OR LOWER(c.name) LIKE LOWER(CONCAT('%', :search, '%'))
                OR LOWER(c.industry) LIKE LOWER(CONCAT('%', :search, '%'))
                OR LOWER(c.headquarters) LIKE LOWER(CONCAT('%', :search, '%')))
            """)
    Page<Company> search(@Param("search") String search, Pageable pageable);
}
