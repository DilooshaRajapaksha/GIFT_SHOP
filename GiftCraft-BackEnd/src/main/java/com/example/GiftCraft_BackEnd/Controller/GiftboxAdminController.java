package com.example.GiftCraft_BackEnd.Controller;

import com.example.GiftCraft_BackEnd.Config.CurrentUser;
import com.example.GiftCraft_BackEnd.DTO.GiftboxCreateDTO;
import com.example.GiftCraft_BackEnd.DTO.GiftboxDetailDTO;
import com.example.GiftCraft_BackEnd.Services.GiftBoxPublicService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

// Admin-only way to create READY-MADE gift boxes (with description + image).
// Normal users build their boxes through GiftBoxController (/api/v1/giftboxes/save).
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin/giftboxes")
public class GiftboxAdminController {

    private final GiftBoxPublicService giftboxpublicService;

    // Create draft giftbox (visible='private')
    @PostMapping
    public GiftboxDetailDTO create(@Valid @RequestBody GiftboxCreateDTO dto) {
        Long adminId = CurrentUser.id(); // TODO: check the user is really an admin after login is added
        return giftboxpublicService.create(dto, adminId);
    }

    // Fetch created giftbox (optional helper)
    @GetMapping("/{id}")
    public GiftboxDetailDTO get(@PathVariable Long id) {
        return giftboxpublicService.get(id);
    }
}
