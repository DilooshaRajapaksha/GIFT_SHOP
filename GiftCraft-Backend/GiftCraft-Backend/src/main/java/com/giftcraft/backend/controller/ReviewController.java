
package com.giftcraft.backend.controller;

import com.giftcraft.backend.dto.PageResponse;
import com.giftcraft.backend.dto.ReviewDtos;
import com.giftcraft.backend.mapper.Mappers;
import com.giftcraft.backend.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {
    private final ReviewService service;
    public ReviewController(ReviewService service) { this.service = service; }

    @GetMapping
    public PageResponse<ReviewDtos.Response> list(
            @RequestParam("productId") Long productId,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<com.giftcraft.backend.entity.Review> p = service.listByProduct(productId, pageable);
        return new PageResponse<>(
                p.getContent().stream().map(Mappers::review).collect(Collectors.toList()),
                p.getNumber(), p.getSize(), p.getTotalElements(), p.getTotalPages()
        );
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ReviewDtos.Response create(@Valid @RequestBody ReviewDtos.Create req) {
        return Mappers.review(service.create(req));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
