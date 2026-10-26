package com.example.GiftCraft_BackEnd.Service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.io.InputStream;
import java.util.UUID;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;

/*
 * Saves an uploaded image into the uploads/images folder and returns its link.
 * Only the link is stored in the database (in PRODUCT.image_url or HOME_ITEM.image_url).
 */
@Service
public class ImageStorageService {

    @Value("${app.image-dir}")
    private String imageDir;

    public String save(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(BAD_REQUEST, "Please choose an image");
        }
        // don't trust the file name or the type the browser says - look at the first bytes of the file
        String extension;
        try {
            extension = detectImageType(file);
        } catch (IOException e) {
            extension = null;
        }
        if (extension == null) {
            throw new ResponseStatusException(BAD_REQUEST, "Only JPG, PNG, WEBP or GIF images are allowed");
        }

        try {
            Path folder = Paths.get(imageDir).toAbsolutePath().normalize();
            Files.createDirectories(folder);

            // our own random name, never the user's file name (it could contain "../" etc.)
            String fileName = System.currentTimeMillis() + "_" + UUID.randomUUID().toString().substring(0, 8) + extension;
            file.transferTo(folder.resolve(fileName));

            return "/images/" + fileName;   // served by WebConfig
        } catch (IOException e) {
            throw new ResponseStatusException(INTERNAL_SERVER_ERROR, "Could not save the image: " + e.getMessage());
        }
    }

    /*
     * Every image format starts with a few fixed "magic" bytes.
     * A renamed .exe or .html file won't have them, so it gets rejected.
     */
    private String detectImageType(MultipartFile file) throws IOException {
        byte[] h = new byte[12];
        int read;
        try (InputStream in = file.getInputStream()) {
            read = in.readNBytes(h, 0, h.length);
        }
        if (read >= 3 && (h[0] & 0xFF) == 0xFF && (h[1] & 0xFF) == 0xD8 && (h[2] & 0xFF) == 0xFF) {
            return ".jpg";
        }
        if (read >= 8 && (h[0] & 0xFF) == 0x89 && h[1] == 'P' && h[2] == 'N' && h[3] == 'G') {
            return ".png";
        }
        if (read >= 6 && h[0] == 'G' && h[1] == 'I' && h[2] == 'F' && h[3] == '8') {
            return ".gif";
        }
        if (read >= 12 && h[0] == 'R' && h[1] == 'I' && h[2] == 'F' && h[3] == 'F'
                && h[8] == 'W' && h[9] == 'E' && h[10] == 'B' && h[11] == 'P') {
            return ".webp";
        }
        return null;
    }
}
