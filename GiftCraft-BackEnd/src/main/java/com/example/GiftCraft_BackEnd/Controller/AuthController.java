package com.example.GiftCraft_BackEnd.Controller;

import com.example.GiftCraft_BackEnd.DTO.LoginRequest;
import com.example.GiftCraft_BackEnd.DTO.ProfileUpdateRequest;
import com.example.GiftCraft_BackEnd.DTO.RegisterRequest;
import com.example.GiftCraft_BackEnd.Service.UserService;
import com.example.GiftCraft_BackEnd.Security.Jwt;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;

@RestController
@RequestMapping("/")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> loginUser(@RequestBody LoginRequest loginRequest) {
        return userService.loginUser(loginRequest);
    }

    @PostMapping("/request-reset")
    public ResponseEntity<String> requestReset(@RequestBody Map<String, String> body) {
        return userService.requestResetCode(body.get("email"));
    }

    @PostMapping("/confirm-reset")
    public ResponseEntity<String> confirmReset(@RequestBody Map<String, String> body) {
        return userService.confirmReset(
                body.get("email"),
                body.get("code"),
                body.get("newPassword"),
                body.get("confirmNewPassword")
        );
    }

    @Transactional
    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody RegisterRequest register) {
        return userService.registerUser(register);
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile(HttpServletRequest request) {
        return userService.getUserProfile(request);
    }

    @PutMapping("/profile/update")
    public ResponseEntity<String> updateUserProfile(@RequestBody ProfileUpdateRequest updateRequest, HttpServletRequest request) {
        return userService.updateUserProfile(updateRequest, request);
    }

    @DeleteMapping("/profile/delete")
    public ResponseEntity<String> deleteAccount(@RequestBody Map<String, String> body, HttpServletRequest request) {
        String currentPassword = body.get("currentPassword"); 
        return userService.deleteUserAccount(currentPassword, request); 
    }
}