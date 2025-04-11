package com.vit.video_sharing_backend.util;

import java.util.Locale;
import java.util.ResourceBundle;

public class LocalizationUtil {
    private static ResourceBundle messages;

    static {
        setLocale("en");
    }
    public static void setLocale(String language) {
        Locale locale = new Locale(language);
        messages = ResourceBundle.getBundle("messages", locale);
    }
    public static String getMessage(String key) {
        return messages.getString(key);
    }
}