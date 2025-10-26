package com.example.GiftCraft_BackEnd.Controller;

import com.example.GiftCraft_BackEnd.DTO.GiftboxCreateDTO;
import com.example.GiftCraft_BackEnd.DTO.GiftboxDetailDTO;
import com.example.GiftCraft_BackEnd.Services.GiftBoxPublicService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin/giftboxes")
@CrossOrigin(origins = {"http://localhost:3000","http://localhost:5173"})
public class GiftboxAdminController {

    private final GiftBoxPublicService giftboxpublicService;

    // Create draft giftbox (visible='private')
    @PostMapping
    public GiftboxDetailDTO create(@Valid @RequestBody GiftboxCreateDTO dto) {
        Long adminId = 1L; // TODO: replace after you wire authentication
        return giftboxpublicService.create(dto, adminId);
    }

    // Fetch created giftbox (optional helper)
    @GetMapping("/{id}")
    public GiftboxDetailDTO get(@PathVariable Long id) {
        return giftboxpublicService.get(id);
    }
}
