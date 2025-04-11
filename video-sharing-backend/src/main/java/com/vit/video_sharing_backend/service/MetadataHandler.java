package com.vit.video_sharing_backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.vit.video_sharing_backend.model.VideoAsset;
import jakarta.xml.bind.JAXBContext;
import jakarta.xml.bind.Marshaller;
import jakarta.xml.bind.Unmarshaller;

import java.io.StringReader;
import java.io.StringWriter;
import java.nio.file.Path;

public class MetadataHandler {
    private static final ObjectMapper jsonMapper = new ObjectMapper();

    public static void saveAsXml(VideoAsset asset, Path path) throws Exception {
        JAXBContext context = JAXBContext.newInstance(VideoAsset.class);
        Marshaller marshaller = context.createMarshaller();
        marshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, true);
        marshaller.marshal(asset, path.toFile());
    }

    public static void saveAsJson(VideoAsset asset, Path path) throws Exception {
        jsonMapper.writeValue(path.toFile(), asset);
    }

    public static VideoAsset loadFromXml(Path path) throws Exception {
        JAXBContext context = JAXBContext.newInstance(VideoAsset.class);
        Unmarshaller unmarshaller = context.createUnmarshaller();
        return (VideoAsset) unmarshaller.unmarshal(path.toFile());
    }

    public static VideoAsset loadFromJson(Path path) throws Exception {
        return jsonMapper.readValue(path.toFile(), VideoAsset.class);
    }

    public static String getFileName(VideoAsset asset, String format) {
        return "%s_v%d.%s".formatted(asset.fileName(), asset.version(), format);
    }
}