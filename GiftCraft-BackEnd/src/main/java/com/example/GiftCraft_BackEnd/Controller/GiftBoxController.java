package com.example.GiftCraft_BackEnd.Controller;

import com.example.GiftCraft_BackEnd.DTO.GiftBoxCreateRequest;
import com.example.GiftCraft_BackEnd.DTO.GiftBoxResponse;
import com.example.GiftCraft_BackEnd.Services.GiftBoxService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

/*
 * Public gift box endpoints for "Build Your Own".
 * The old /list, /update and /delete endpoints were removed: with no login every
 * visitor is the same user, so anyone could have edited or deleted any box.
 * Editing / deleting boxes is now only in the admin panel (AdminProductController).
 */
@RestController
@RequestMapping("/api/v1/giftboxes")
public class GiftBoxController {

    private final GiftBoxService service;

    public GiftBoxController(GiftBoxService service) {
        this.service = service;
    }

    @PostMapping("/save")
    public GiftBoxResponse create(@Valid @RequestBody GiftBoxCreateRequest body) {
        return service.create(body);
    }

    @GetMapping("/{id}")
    public GiftBoxResponse get(@PathVariable Long id) {
        return service.get(id);
    }

    @PostMapping("/quote")
    public GiftBoxResponse quote(@Valid @RequestBody GiftBoxCreateRequest draft) {
        return service.quote(draft);
    }
}
