package com.referai.profile.mapper;

import com.referai.profile.dto.SkillDto;
import com.referai.profile.entity.Skill;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.ReportingPolicy;

@Mapper(
    componentModel = MappingConstants.ComponentModel.SPRING,
    unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface SkillMapper {

    @Mapping(source = "userProfile", target = ".")
    SkillDto toDto(Skill entity);

    @Mapping(target = "userProfile", ignore = true)
    Skill toEntity(SkillDto dto);
}
