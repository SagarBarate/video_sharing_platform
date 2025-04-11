package com.vit.video_sharing_backend.model;

import java.time.ZonedDateTime;

public sealed interface AuditAction permits UploadAction, UpdateAction {
    String userId();
    ZonedDateTime timestamp();
    String description();
}