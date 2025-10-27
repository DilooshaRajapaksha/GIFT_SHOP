
package com.giftcraft.backend.service;

import com.giftcraft.backend.dto.ReviewDtos;
import com.giftcraft.backend.entity.Product;
import com.giftcraft.backend.entity.Review;
import com.giftcraft.backend.repository.ProductRepository;
import com.giftcraft.backend.repository.ReviewRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ReviewService {
    private final ReviewRepository repo;
    private final ProductRepository productRepo;

    public ReviewService(ReviewRepository repo, ProductRepository productRepo) {
        this.repo = repo;
        this.productRepo = productRepo;
    }

    public Page<Review> listByProduct(Long productId, Pageable pageable) {
        return repo.findByProduct_Id(productId, pageable);
    }

    @Transactional
    public Review create(ReviewDtos.Create req) {
        Product product = productRepo.findById(req.getProductId())
                .orElseThrow(() -> new EntityNotFoundException("Product not found: " + req.getProductId()));
        Review r = new Review();
        r.setUserId(req.getUserId());
        r.setProduct(product);
        r.setRating(req.getRating());
        r.setComment(req.getComment());
        return repo.save(r);
    }

    public Review get(Long id) {
        return repo.findById(id).orElseThrow(() -> new EntityNotFoundException("Review not found: " + id));
    }

    @Transactional
    public void delete(Long id) {
        if (!repo.existsById(id)) throw new EntityNotFoundException("Review not found: " + id);
        repo.deleteById(id);
    }
}
