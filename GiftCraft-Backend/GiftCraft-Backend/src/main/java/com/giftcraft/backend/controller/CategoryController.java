
package com.giftcraft.backend.controller;

import com.giftcraft.backend.dto.CategoryCreateUpdateRequest;
import com.giftcraft.backend.mapper.Mappers;
import com.giftcraft.backend.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    private final CategoryService service;
    public CategoryController(CategoryService service) { this.service = service; }

    @GetMapping
    public java.util.List<CategoryCreateUpdateRequest.Response> list() {
        return service.list().stream().map(Mappers::category).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public CategoryCreateUpdateRequest.Response get(@PathVariable Long id) {
        return Mappers.category(service.get(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CategoryCreateUpdateRequest.Response create(@Valid @RequestBody CategoryCreateUpdateRequest req) {
        return Mappers.category(service.create(req));
    }

    @PutMapping("/{id}")
    public CategoryCreateUpdateRequest.Response update(@PathVariable Long id, @Valid @RequestBody CategoryCreateUpdateRequest req) {
        return Mappers.category(service.update(id, req));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
