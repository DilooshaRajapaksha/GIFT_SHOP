package com.example.GiftCraft_BackEnd.Controller;

import com.example.GiftCraft_BackEnd.DTO.ProductSaveRequest;
import com.example.GiftCraft_BackEnd.Entity.Product;
import com.example.GiftCraft_BackEnd.Repo.GiftBoxItemRepo;
import com.example.GiftCraft_BackEnd.Repo.ProductRepo;
import jakarta.validation.Valid;
import org.springframework.data.domain.Sort;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

import static org.springframework.http.HttpStatus.NOT_FOUND;

// admin: add / edit / delete products (single items and gift boxes), incl. their image link
@RestController
@RequestMapping("/api/v1/admin/products")
public class AdminProductController {

    private final ProductRepo productRepo;
    private final GiftBoxItemRepo giftBoxItemRepo;

    public AdminProductController(ProductRepo productRepo, GiftBoxItemRepo giftBoxItemRepo) {
        this.productRepo = productRepo;
        this.giftBoxItemRepo = giftBoxItemRepo;
    }

    @GetMapping
    public List<Product> list() {
        return productRepo.findAll(Sort.by(Sort.Direction.DESC, "id"));
    }

    @PostMapping
    public Product create(@Valid @RequestBody ProductSaveRequest req) {
        Product p = new Product();
        copy(req, p);
        return productRepo.save(p);
    }

    @PutMapping("/{id}")
    public Product update(@PathVariable Long id, @Valid @RequestBody ProductSaveRequest req) {
        Product p = productRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Product not found"));
        copy(req, p);
        return productRepo.save(p);
    }

    // if the product is still inside a gift box the database blocks the delete,
    // GlobalExceptionHandler then returns 409 -> admin can set it to "private" instead
    @DeleteMapping("/{id}")
    @Transactional
    public void delete(@PathVariable Long id) {
        Product p = productRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Product not found"));
        if ("giftbox".equalsIgnoreCase(p.getProductType())) {
            giftBoxItemRepo.deleteAllByGiftboxId(id);   // remove what's inside the box first
        }
        productRepo.delete(p);
        productRepo.flush();   // run the DELETE now so a foreign key error is caught here
    }

    private void copy(ProductSaveRequest req, Product p) {
        p.setName(req.getName().trim());
        p.setDescription(req.getDescription());
        p.setPrice(req.getPrice());
        p.setStock(req.getStock());
        p.setProductType(req.getProductType());
        p.setVisible(req.getVisible());
        p.setCategoryId(req.getCategoryId());
        p.setImageUrl(blankToNull(req.getImageUrl()));
        p.setBestSeller(Boolean.TRUE.equals(req.getBestSeller()));
    }

    private String blankToNull(String s) {
        return (s == null || s.isBlank()) ? null : s.trim();
    }
}
