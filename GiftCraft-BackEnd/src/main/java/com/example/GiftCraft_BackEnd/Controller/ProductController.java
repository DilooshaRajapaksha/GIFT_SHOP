package com.example.GiftCraft_BackEnd.Controller;

import com.example.GiftCraft_BackEnd.DTO.ProductListItem;
import com.example.GiftCraft_BackEnd.Repo.ProductRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

/*
 * The frontend was calling /api/v1/products but this endpoint never existed,
 * so Home / Shop Items / Gift Boxes had nothing to show.
 * It uses ProductRepo.search(...) which was already written but never used.
 *
 * Example: GET /api/v1/products?type=single&visible=public&min=0&max=2000&search=mug
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/products")
public class ProductController {

    private final ProductRepo productRepo;

    @GetMapping
    public List<ProductListItem> list(@RequestParam(required = false) String type,
                                      @RequestParam(required = false) String visible,
                                      @RequestParam(required = false) BigDecimal min,
                                      @RequestParam(required = false) BigDecimal max,
                                      @RequestParam(required = false) Long categoryId,
                                      @RequestParam(required = false) String search) {
        // empty text from the search box should mean "no search"
        String text = (search == null || search.isBlank()) ? null : search.trim();

        return productRepo.search(type, visible, min, max, categoryId, text)
                .stream()
                .map(p -> new ProductListItem(
                        p.getId(), p.getName(), p.getPrice(), p.getStock(), p.getCategoryId(), p.getImageUrl()
                ))
                .toList();
    }
}
