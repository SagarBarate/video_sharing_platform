package com.vit.video_sharing_backend.model;

import java.time.ZonedDateTime;

public record UploadAction(String userId, ZonedDateTime timestamp, String description) implements AuditAction {}