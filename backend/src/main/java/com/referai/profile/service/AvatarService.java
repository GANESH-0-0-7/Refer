package com.referai.profile.service;

import com.referai.profile.exception.InvalidAvatarException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Set;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AvatarService {

    @Value("${app.upload.avatar.path:D:\\ReferAI\\uploads\\avatars}")
    private String avatarUploadPath;

    @Value("${app.upload.avatar.max-size:5242880}")
    private long maxAvatarSize;

    private static final Set<String> ALLOWED_EXTENSIONS = Set.of("jpg", "jpeg", "png");
    private static final Set<String> ALLOWED_MIME_TYPES = Set.of("image/jpeg", "image/png");

    public String uploadAvatar(MultipartFile file) {
        log.info("Uploading avatar file: {}", file.getOriginalFilename());
        
        validateFile(file);
        
        try {
            String fileName = generateFileName(file.getOriginalFilename());
            Path uploadDir = Paths.get(avatarUploadPath);
            
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
                log.debug("Created upload directory: {}", uploadDir);
            }
            
            Path filePath = uploadDir.resolve(fileName);
            Files.write(filePath, file.getBytes());
            
            String avatarUrl = "/uploads/avatars/" + fileName;
            log.info("Avatar uploaded successfully: {}", avatarUrl);
            return avatarUrl;
        } catch (IOException e) {
            log.error("Failed to upload avatar", e);
            throw InvalidAvatarException.uploadFailed("File system error: " + e.getMessage());
        }
    }

    public void deleteAvatar(String avatarUrl) {
        if (avatarUrl == null || avatarUrl.isBlank()) {
            return;
        }
        
        try {
            String fileName = extractFileName(avatarUrl);
            Path filePath = Paths.get(avatarUploadPath).resolve(fileName);
            
            if (Files.exists(filePath)) {
                Files.delete(filePath);
                log.info("Avatar deleted: {}", avatarUrl);
            }
        } catch (IOException e) {
            log.warn("Failed to delete avatar: {}", avatarUrl, e);
        }
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw InvalidAvatarException.uploadFailed("File is empty");
        }
        
        if (file.getSize() > maxAvatarSize) {
            throw InvalidAvatarException.fileTooLarge(file.getSize(), maxAvatarSize);
        }
        
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_MIME_TYPES.contains(contentType)) {
            throw InvalidAvatarException.invalidFileType(file.getOriginalFilename());
        }
        
        String originalFileName = file.getOriginalFilename();
        if (originalFileName == null) {
            throw InvalidAvatarException.uploadFailed("File name is missing");
        }
        
        String extension = getFileExtension(originalFileName).toLowerCase();
        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw InvalidAvatarException.invalidFileType(originalFileName);
        }
    }

    private String generateFileName(String originalFileName) {
        String extension = getFileExtension(originalFileName);
        return UUID.randomUUID() + "." + extension;
    }

    private String getFileExtension(String fileName) {
        int lastDot = fileName.lastIndexOf(".");
        return lastDot > 0 ? fileName.substring(lastDot + 1) : "";
    }

    private String extractFileName(String avatarUrl) {
        return avatarUrl.substring(avatarUrl.lastIndexOf("/") + 1);
    }
}
