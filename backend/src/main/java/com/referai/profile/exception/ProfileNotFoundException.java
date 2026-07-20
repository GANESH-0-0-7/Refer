package com.referai.profile.exception;

public class ProfileNotFoundException extends RuntimeException {

    public ProfileNotFoundException(String message) {
        super(message);
    }

    public ProfileNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }

    public static ProfileNotFoundException forUserId(Long userId) {
        return new ProfileNotFoundException("Profile not found for user ID: " + userId);
    }

    public static ProfileNotFoundException forProfileId(Long profileId) {
        return new ProfileNotFoundException("Profile not found with ID: " + profileId);
    }
}
