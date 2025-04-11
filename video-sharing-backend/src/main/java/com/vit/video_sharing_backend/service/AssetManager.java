package com.vit.video_sharing_backend.service;

import com.vit.video_sharing_backend.model.AuditAction;
import com.vit.video_sharing_backend.model.UploadAction;
import com.vit.video_sharing_backend.model.UpdateAction;
import com.vit.video_sharing_backend.model.VideoAsset;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.ZonedDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.function.Predicate;
import java.util.stream.Collectors;

public class AssetManager {
    private final Map<String, List<VideoAsset>> assets = new ConcurrentHashMap<>();
    private final Map<String, List<AuditAction>> auditTrails = new ConcurrentHashMap<>();
    private final ExecutorService executor = Executors.newFixedThreadPool(4);

    // Initialize dummy data
    public AssetManager() {
        // Dummy assets for fileName "asset"
        List<VideoAsset> dummyAssets = List.of(
            new VideoAsset(
                "asset",
                1,
                "Initial upload",
                ZonedDateTime.parse("2025-04-10T10:00:00Z"),
                "Premiere",
                List.of("raw", "v1")
            ),
            new VideoAsset(
                "asset",
                2,
                "Added effects",
                ZonedDateTime.parse("2025-04-10T12:00:00Z"),
                "After Effects",
                List.of("edited", "v2")
            ),
            new VideoAsset(
                "asset",
                3,
                "Final cut",
                ZonedDateTime.parse("2025-04-11T09:00:00Z"),
                "Final Cut Pro",
                List.of("final", "v3")
            )
        );
        assets.put("asset", new ArrayList<>(dummyAssets));

        // Dummy audit trail for fileName "asset"
        List<AuditAction> dummyAudit = List.of(
            new UploadAction("user1", ZonedDateTime.parse("2025-04-10T10:00:00Z"), "Initial upload"),
            new UploadAction("user2", ZonedDateTime.parse("2025-04-10T12:00:00Z"), "Added effects"),
            new UploadAction("user3", ZonedDateTime.parse("2025-04-11T09:00:00Z"), "Final cut")
        );
        auditTrails.put("asset", new ArrayList<>(dummyAudit));
    }

    public String validateAsset(String fileName, long size, String format) {
        Predicate<String> validFormat = fmt -> Set.of("mp4", "mov", "jpg").contains(fmt.toLowerCase());
        if (fileName == null || fileName.isEmpty()) {
            return "Invalid file name";
        }
        if (size <= 0) {
            return "Invalid size";
        }
        if (!validFormat.test(format)) {
            return "Unsupported format";
        }
        return "Valid";
    }

    public int getNextVersion(String fileName) {
        return assets.getOrDefault(fileName, List.of())
                .stream()
                .mapToInt(VideoAsset::version)
                .max()
                .orElse(0) + 1;
    }

    public void saveAsset(VideoAsset asset, String userId) {
        assets.computeIfAbsent(asset.fileName(), k -> new ArrayList<>()).add(asset);
        auditTrails.computeIfAbsent(asset.fileName(), k -> new ArrayList<>())
                .add(new UploadAction(userId, asset.timestamp(), asset.commitMessage()));
    }

    public List<VideoAsset> listVersions(String fileName) {
        return assets.getOrDefault(fileName, List.of())
                .stream()
                .sorted(Comparator.comparing(VideoAsset::version))
                .collect(Collectors.toList());
    }

    public List<VideoAsset> searchByTag(String tag) {
        return assets.values()
                .stream()
                .flatMap(List::stream)
                .filter(asset -> asset.tags().contains(tag))
                .collect(Collectors.toList());
    }

    public void updateAssetsConcurrently(List<VideoAsset> updates, String userId) {
        updates.forEach(asset ->
                executor.submit(() -> {
                    assets.computeIfAbsent(asset.fileName(), k -> new ArrayList<>()).add(asset);
                    auditTrails.computeIfAbsent(asset.fileName(), k -> new ArrayList<>())
                            .add(new UpdateAction(userId, asset.timestamp(), asset.commitMessage()));
                }));
    }

    public List<AuditAction> getAuditTrail(String fileName) {
        return auditTrails.getOrDefault(fileName, List.of());
    }

    public void exportAuditTrail(String fileName, Path outputPath) throws IOException {
        List<String> lines = getAuditTrail(fileName)
                .stream()
                .map(action -> "%s: %s at %s".formatted(action.userId(), action.description(), action.timestamp()))
                .toList();
        Files.write(outputPath, lines);
    }

    public void shutdown() {
        executor.shutdown();
    }
}