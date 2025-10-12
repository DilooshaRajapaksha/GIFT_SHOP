package com.example.GiftCraft_BackEnd.Controller;

import com.example.GiftCraft_BackEnd.DTO.*;
import com.example.GiftCraft_BackEnd.Services.GiftBoxService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("api/v1/giftboxes")
public class GiftBoxController {

    @Autowired
    private GiftBoxService service;

    @PostMapping("/save")
    public GiftBoxResponse create(@Valid @RequestBody GiftBoxCreateRequest body) {
        return service.create(body);
    }

    @GetMapping("/list")
    public List<GiftBoxResponse> list(@RequestParam(defaultValue = "0") int page,
                                      @RequestParam(defaultValue = "20") int size) {
        return service.list(page, size);
    }

    @GetMapping("/{id}")
    public GiftBoxResponse get(@PathVariable Integer id) {
        return service.get(id);
    }

    @PutMapping("/update/{id}")
    public GiftBoxResponse update(@PathVariable Integer id, @Valid @RequestBody GiftBoxUpdateRequest body) {
        return service.update(id, body);
    }

    @DeleteMapping("/delete/{id}")
    public boolean delete(@PathVariable Integer id) {
        return service.delete(id);
    }

    @PostMapping("/quote")
    public GiftBoxResponse quote(@RequestBody GiftBoxCreateRequest draft) {
        return service.quote(draft);
    }

}

