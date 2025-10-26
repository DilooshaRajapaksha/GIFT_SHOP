package com.example.GiftCraft_BackEnd.Controller;

import com.example.GiftCraft_BackEnd.DTO.ProductListItem;
import com.example.GiftCraft_BackEnd.Entity.Product;
import com.example.GiftCraft_BackEnd.Repo.ProductRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequiredArgsConstructor
@RequestMapping("/api/v1/builder")
public class BuilderCatalogController {

    private final ProductRepo productRepo;

    @GetMapping("/catalog")
    public Page<ProductListItem> searchSingles(@RequestParam(required=false) String query,
                                               @RequestParam(required=false) Integer category,
                                               @RequestParam(defaultValue="0") int page,
                                               @RequestParam(defaultValue="12") int size) {
        Page<Product> pg = productRepo.searchSingles(query, category, PageRequest.of(page, size));
      return pg.map(p -> new ProductListItem(
              p.getId(), p.getName(), p.getPrice(), p.getStock(), p.getCategoryId(), p.getImageUrl()
      ));
    }

}
