package com.example.GiftCraft_BackEnd.Controller;

import com.example.GiftCraft_BackEnd.DTO.ProductListItem;
import com.example.GiftCraft_BackEnd.Entity.HomeItem;
import com.example.GiftCraft_BackEnd.Repo.HomeItemRepo;
import com.example.GiftCraft_BackEnd.Repo.ProductRepo;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

/*
 * Everything the home page needs in ONE request:
 * hero slides, categories, banner slides and best sellers.
 * The admin changes these in the admin panel.
 */
@RestController
@RequestMapping("/api/v1/home")
public class HomeController {

    private final HomeItemRepo homeItemRepo;
    private final ProductRepo productRepo;

    public HomeController(HomeItemRepo homeItemRepo, ProductRepo productRepo) {
        this.homeItemRepo = homeItemRepo;
        this.productRepo = productRepo;
    }

    @GetMapping
    public Map<String, Object> home() {
        List<HomeItem> items = homeItemRepo.findByActiveTrueOrderByTypeAscSortOrderAscIdAsc();

        List<ProductListItem> bestSellers = productRepo.findByBestSellerTrueAndVisibleOrderByIdDesc("public")
                .stream()
                .map(p -> new ProductListItem(
                        p.getId(), p.getName(), p.getPrice(), p.getStock(), p.getCategoryId(), p.getImageUrl()
                ))
                .toList();

        return Map.of(
                "hero", byType(items, "HERO"),
                "categories", byType(items, "CATEGORY"),
                "banners", byType(items, "BANNER"),
                "bestSellers", bestSellers
        );
    }

    private List<HomeItem> byType(List<HomeItem> items, String type) {
        return items.stream().filter(i -> type.equals(i.getType())).toList();
    }
}
