package com.giftcraft.backend.controller;

import com.giftcraft.backend.dto.PageResponse;
import com.giftcraft.backend.dto.ProductDtos;
import com.giftcraft.backend.mapper.Mappers;
import com.giftcraft.backend.service.ProductsService; // ✅ updated import
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final ProductsService service; // ✅ updated type

    public ProductController(ProductsService service) { // ✅ updated constructor
        this.service = service;
    }

    @GetMapping
    public PageResponse<ProductDtos.Response> list(
            @RequestParam(value = "q", required = false) String q,
            @RequestParam(value = "visibility", required = false) String visibility,
            @RequestParam(value = "categoryId", required = false) Long categoryId,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<com.giftcraft.backend.entity.Product> p = service.search(q, visibility, categoryId, pageable);
        return new PageResponse<>(
                p.getContent().stream().map(Mappers::product).collect(Collectors.toList()),
                p.getNumber(), p.getSize(), p.getTotalElements(), p.getTotalPages()
        );
    }

    @GetMapping("/{id}")
    public ProductDtos.Response get(@PathVariable Long id) {
        return Mappers.product(service.get(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProductDtos.Response create(@Valid @RequestBody ProductDtos.CreateOrUpdate req) {
        return Mappers.product(service.create(req));
    }

    @PutMapping("/{id}")
    public ProductDtos.Response update(@PathVariable Long id, @Valid @RequestBody ProductDtos.CreateOrUpdate req) {
        return Mappers.product(service.update(id, req));
    }

    @PatchMapping("/{id}/stock")
    public ProductDtos.Response adjustStock(@PathVariable Long id, @RequestParam("delta") int delta) {
        return Mappers.product(service.adjustStock(id, delta));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
