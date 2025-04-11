package com.vit.video_sharing_backend.model;

import java.time.ZonedDateTime;
import java.util.List;

public record VideoAsset(
        String fileName,
        int version,
        String commitMessage,
        ZonedDateTime timestamp,
        String editingSoftware,
        List<String> tags
) {
}