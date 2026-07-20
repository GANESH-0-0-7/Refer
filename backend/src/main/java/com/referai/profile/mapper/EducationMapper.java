package com.referai.profile.mapper;

import com.referai.profile.dto.EducationDto;
import com.referai.profile.entity.Education;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import org.mapstruct.ReportingPolicy;

@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface EducationMapper {

    EducationDto toDto(Education entity);

    Education toEntity(EducationDto dto);
}