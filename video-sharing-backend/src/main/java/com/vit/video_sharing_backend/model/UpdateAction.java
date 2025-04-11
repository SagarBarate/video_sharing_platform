package com.vit.video_sharing_backend.model;

import java.time.ZonedDateTime;

public record UpdateAction(String userId, ZonedDateTime timestamp, String description) implements AuditAction {}