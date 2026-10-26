package com.example.GiftCraft_BackEnd.Controller;

import com.example.GiftCraft_BackEnd.DTO.LoginRequest;
import com.example.GiftCraft_BackEnd.Security.AdminTokenService;
import com.example.GiftCraft_BackEnd.Security.LoginAttemptService;
import com.example.GiftCraft_BackEnd.Service.ImageStorageService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Map;

import static org.springframework.http.HttpStatus.TOO_MANY_REQUESTS;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

@RestController
@RequestMapping("/api/v1/admin")
public class AdminController {

    private final ImageStorageService imageStorageService;
    private final AdminTokenService tokenService;
    private final LoginAttemptService attempts;

    @Value("${app.admin-password}")
    private String adminPassword;

    public AdminController(ImageStorageService imageStorageService,
                           AdminTokenService tokenService,
                           LoginAttemptService attempts) {
        this.imageStorageService = imageStorageService;
        this.tokenService = tokenService;
        this.attempts = attempts;
    }

    // password in -> token out. This is the only admin URL that does not need a token
    @PostMapping("/login")
    public Map<String, Object> login(@Valid @RequestBody LoginRequest body, HttpServletRequest request) {
        String ip = request.getRemoteAddr();

        if (attempts.isBlocked(ip)) {
            throw new ResponseStatusException(TOO_MANY_REQUESTS,
                    "Too many wrong passwords. Try again in " + attempts.minutesLeft(ip) + " minutes.");
        }

        if (!samePassword(body.getPassword(), adminPassword)) {
            attempts.failed(ip);
            throw new ResponseStatusException(UNAUTHORIZED, "Wrong password");
        }

        attempts.succeeded(ip);
        return Map.of(
                "token", tokenService.createToken(),
                "expiresAt", System.currentTimeMillis() + tokenService.validForMs()
        );
    }

    // upload one image -> returns { "url": "/images/xxxx.jpg" }
    @PostMapping(value = "/images", consumes = "multipart/form-data")
    public Map<String, String> uploadImage(@RequestParam("file") MultipartFile file) {
        return Map.of("url", imageStorageService.save(file));
    }

    // MessageDigest.isEqual takes the same time for every wrong guess (safer than equals)
    private boolean samePassword(String given, String real) {
        if (given == null || real == null || real.isBlank()) return false;
        return MessageDigest.isEqual(given.getBytes(StandardCharsets.UTF_8), real.getBytes(StandardCharsets.UTF_8));
    }
}
