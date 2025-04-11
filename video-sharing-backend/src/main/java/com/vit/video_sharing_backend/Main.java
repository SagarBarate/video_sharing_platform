package com.vit.video_sharing_backend;

import com.vit.video_sharing_backend.model.AuditAction;
import com.vit.video_sharing_backend.model.UploadAction;
import com.vit.video_sharing_backend.model.UpdateAction;
import com.vit.video_sharing_backend.model.VideoAsset;
import com.vit.video_sharing_backend.service.AssetManager;
import com.vit.video_sharing_backend.util.LocalizationUtil;

import java.nio.file.Path;
import java.util.Arrays;
import java.util.List;
import java.util.Scanner;
import java.util.stream.IntStream;

public class Main {
    private static final AssetManager assetManager = new AssetManager();
    private static final Scanner scanner = new Scanner(System.in);

    public static void main(String[] args) {
        LocalizationUtil.setLocale("en"); // Default to English
        while (true) {
            System.out.println(LocalizationUtil.getMessage("menu"));
            String choice = scanner.nextLine();

            switch (choice) {
                case "1" -> uploadAsset();
                case "2" -> listAssetVersions();
                case "3" -> searchAssets();
                case "4" -> batchUpdateAssets();
                case "5" -> viewAuditTrail();
                case "6" -> exportAuditTrail();
                case "7" -> {
                    System.out.println(LocalizationUtil.getMessage("exit"));
                    System.exit(0);
                }
                case "lang" -> changeLanguage();
                default -> System.out.println(LocalizationUtil.getMessage("invalid_choice"));
            }
        }
    }

    private static void uploadAsset() {
        System.out.println(LocalizationUtil.getMessage("enter_user_id"));
        String userId = scanner.nextLine();
        System.out.println(LocalizationUtil.getMessage("enter_commit_message"));
        String commitMessage = scanner.nextLine();
        System.out.println(LocalizationUtil.getMessage("enter_editing_software"));
        String editingSoftware = scanner.nextLine();
        System.out.println(LocalizationUtil.getMessage("enter_tags"));
        String tagsInput = scanner.nextLine();
        System.out.println(LocalizationUtil.getMessage("enter_file_format"));
        String format = scanner.nextLine();
        System.out.println(LocalizationUtil.getMessage("enter_file_size"));
        long size;
        try {
            size = Long.parseLong(scanner.nextLine());
        } catch (NumberFormatException e) {
            System.out.println(LocalizationUtil.getMessage("invalid_size"));
            return;
        }

        String fileName = "asset";
        String validation = assetManager.validateAsset(fileName, size, format);
        if (!validation.equals("Valid")) {
            System.out.println(LocalizationUtil.getMessage("validation_failed") + ": " + validation);
            return;
        }

        int version = assetManager.getNextVersion(fileName);
        VideoAsset asset = new VideoAsset(
                fileName,
                version,
                commitMessage.isEmpty() ? LocalizationUtil.getMessage("no_message") : commitMessage,
                java.time.ZonedDateTime.now(),
                editingSoftware.isEmpty() ? LocalizationUtil.getMessage("unknown") : editingSoftware,
                tagsInput.isEmpty() ? List.of() : Arrays.asList(tagsInput.split(",")));
        assetManager.saveAsset(asset, userId);
        System.out.println(LocalizationUtil.getMessage("uploaded") + ": " + asset);
    }

    private static void listAssetVersions() {
        System.out.println(LocalizationUtil.getMessage("enter_file_name"));
        String fileName = scanner.nextLine();
        List<VideoAsset> versions = assetManager.listVersions(fileName);
        if (versions.isEmpty()) {
            System.out.println(LocalizationUtil.getMessage("no_versions") + " " + fileName);
        } else {
            versions.stream()
                    .sorted((a, b) -> Integer.compare(b.version(), a.version())) // Descending order
                    .forEach(asset -> System.out.println(
                            LocalizationUtil.getMessage("version") + " " + asset.version() +
                                    ": " + asset.commitMessage() + " at " + asset.timestamp()));
        }
    }

    private static void searchAssets() {

        System.out.println(LocalizationUtil.getMessage("enter_tag"));
        String tag = scanner.nextLine();
        List<VideoAsset> results = assetManager.searchByTag(tag);
        if (results.isEmpty()) {
            System.out.println(LocalizationUtil.getMessage("no_assets_found") + " " + tag);
        } else {
            results.forEach(asset -> System.out.println(
                    asset.fileName() + " v" + asset.version() + ": " + asset.tags()));
        }
    }

    private static void batchUpdateAssets() {
        System.out.println(LocalizationUtil.getMessage("enter_user_id"));
        String userId = scanner.nextLine();
        System.out.println(LocalizationUtil.getMessage("enter_number_assets"));
        int count;
        try {
            count = Integer.parseInt(scanner.nextLine());
        } catch (NumberFormatException e) {
            System.out.println(LocalizationUtil.getMessage("invalid_number"));
            return;
        }

        List<VideoAsset> updates = IntStream.rangeClosed(1, count)
                .mapToObj(i -> new VideoAsset(
                        "asset",
                        assetManager.getNextVersion("asset"),
                        LocalizationUtil.getMessage("batch_update") + " " + i,
                        java.time.ZonedDateTime.now(),
                        LocalizationUtil.getMessage("unknown"),
                        List.of("batch")))
                .toList();

        assetManager.updateAssetsConcurrently(updates, userId);
        System.out.println(LocalizationUtil.getMessage("batch_started") + " " + count + " " + LocalizationUtil.getMessage("assets"));
    }

    private static void viewAuditTrail() {
        String fileName = "asset";
        List<AuditAction> trail = assetManager.getAuditTrail(fileName);
        if (trail.isEmpty()) {
            System.out.println(LocalizationUtil.getMessage("no_audit_trail") + " " + fileName);
        } else {
            trail.forEach(action -> {
                String actionType = switch (action) {
                    case UploadAction uploadAction -> LocalizationUtil.getMessage("upload");
                    case UpdateAction updateAction -> LocalizationUtil.getMessage("update");
                };
                System.out.println(action.userId() + ": " + actionType + " - " +
                        action.description() + " at " + action.timestamp());
            });
        }
    }

    private static void exportAuditTrail() {
        String fileName = "asset";
        try {
            Path outputPath = Path.of("audit_" + fileName + ".txt");
            assetManager.exportAuditTrail(fileName, outputPath);
            System.out.println(LocalizationUtil.getMessage("audit_exported") + " " + outputPath);
        } catch (Exception e) {
            System.out.println(LocalizationUtil.getMessage("audit_export_error") + ": " + e.getMessage());
        }
    }

    private static void changeLanguage() {
        System.out.println(LocalizationUtil.getMessage("select_language"));
        System.out.println("1. English");
        System.out.println("2. French");
        String langChoice = scanner.nextLine();
        LocalizationUtil.setLocale(langChoice.equals("2") ? "fr" : "en");
        System.out.println(LocalizationUtil.getMessage("language_changed"));

    }
}