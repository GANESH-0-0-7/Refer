package com.referai.profile.mapper;

import com.referai.profile.dto.UserProfileDto;
import com.referai.profile.entity.UserProfile;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import org.mapstruct.ReportingPolicy;

@Mapper(
    componentModel = MappingConstants.ComponentModel.SPRING,
    unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface UserProfileMapper {

    UserProfileDto toDto(UserProfile entity);

    UserProfile toEntity(UserProfileDto dto);
}
