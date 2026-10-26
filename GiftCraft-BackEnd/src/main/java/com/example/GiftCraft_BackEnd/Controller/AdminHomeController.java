package com.example.GiftCraft_BackEnd.Controller;

import com.example.GiftCraft_BackEnd.DTO.HomeItemRequest;
import com.example.GiftCraft_BackEnd.Entity.HomeItem;
import com.example.GiftCraft_BackEnd.Repo.HomeItemRepo;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

import static org.springframework.http.HttpStatus.NOT_FOUND;

// admin: change the home page slides, categories and banners
@RestController
@RequestMapping("/api/v1/admin/home-items")
public class AdminHomeController {

    private final HomeItemRepo homeItemRepo;

    public AdminHomeController(HomeItemRepo homeItemRepo) {
        this.homeItemRepo = homeItemRepo;
    }

    @GetMapping
    public List<HomeItem> list() {
        return homeItemRepo.findAllByOrderByTypeAscSortOrderAscIdAsc();
    }

    @PostMapping
    public HomeItem create(@Valid @RequestBody HomeItemRequest req) {
        HomeItem item = new HomeItem();
        copy(req, item);
        return homeItemRepo.save(item);
    }

    @PutMapping("/{id}")
    public HomeItem update(@PathVariable Long id, @Valid @RequestBody HomeItemRequest req) {
        HomeItem item = homeItemRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Home item not found"));
        copy(req, item);
        return homeItemRepo.save(item);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        if (!homeItemRepo.existsById(id)) {
            throw new ResponseStatusException(NOT_FOUND, "Home item not found");
        }
        homeItemRepo.deleteById(id);
    }

    private void copy(HomeItemRequest req, HomeItem item) {
        item.setType(req.getType());
        item.setTitle(req.getTitle());
        item.setSubtitle(req.getSubtitle());
        item.setButtonText(req.getButtonText());
        item.setLinkUrl(req.getLinkUrl());
        item.setImageUrl(req.getImageUrl());
        item.setSortOrder(req.getSortOrder() != null ? req.getSortOrder() : 0);
        item.setActive(req.getActive() == null || req.getActive());
    }
}
