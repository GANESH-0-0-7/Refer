package com.referai.profile.exception;

public class InvalidAvatarException extends RuntimeException {

    public InvalidAvatarException(String message) {
        super(message);
    }

    public InvalidAvatarException(String message, Throwable cause) {
        super(message, cause);
    }

    public static InvalidAvatarException invalidFileType(String fileName) {
        return new InvalidAvatarException("Invalid file type for avatar: " + fileName + ". Only PNG, JPG, and JPEG are allowed.");
    }

    public static InvalidAvatarException fileTooLarge(long fileSizeBytes, long maxSizeBytes) {
        return new InvalidAvatarException("Avatar file size (" + fileSizeBytes + " bytes) exceeds maximum allowed size (" + maxSizeBytes + " bytes).");
    }

    public static InvalidAvatarException uploadFailed(String reason) {
        return new InvalidAvatarException("Avatar upload failed: " + reason);
    }
}
