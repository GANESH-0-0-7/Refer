package com.referai.profile.mapper;

import com.referai.profile.dto.WorkExperienceDto;
import com.referai.profile.entity.WorkExperience;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.ReportingPolicy;

@Mapper(
    componentModel = MappingConstants.ComponentModel.SPRING,
    unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface WorkExperienceMapper {

    @Mapping(source = "userProfile", target = ".")
    WorkExperienceDto toDto(WorkExperience entity);

    @Mapping(target = "userProfile", ignore = true)
    WorkExperience toEntity(WorkExperienceDto dto);
}
