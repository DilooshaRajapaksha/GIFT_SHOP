package com.giftcraft.backend.service;

import com.giftcraft.backend.dto.ProductDtos;
import com.giftcraft.backend.entity.Category;
import com.giftcraft.backend.entity.Product;
import com.giftcraft.backend.repository.CategoryRepository;
import com.giftcraft.backend.repository.ProductRepository;
import com.giftcraft.backend.spec.ProductSpecifications;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProductsService {
    private final ProductRepository repo;
    private final CategoryRepository categoryRepo;

    public ProductsService(ProductRepository repo, CategoryRepository categoryRepo) {
        this.repo = repo;
        this.categoryRepo = categoryRepo;
    }

    public Page<Product> search(String q, String visibility, Long categoryId, Pageable pageable) {
        Specification<Product> spec = Specification.where(ProductSpecifications.textSearch(q))
                .and(ProductSpecifications.hasVisibility(visibility))
                .and(ProductSpecifications.inCategory(categoryId));
        return repo.findAll(spec, pageable);
    }

    public Product get(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found: " + id));
    }

    @Transactional
    public Product create(ProductDtos.CreateOrUpdate req) {
        Category cat = categoryRepo.findById(req.getCategoryId())
                .orElseThrow(() -> new EntityNotFoundException("Category not found: " + req.getCategoryId()));

        Product p = new Product();
        p.setCategory(cat);
        p.setName(req.getName());
        p.setDescription(req.getDescription());
        p.setPrice(req.getPrice());
        p.setStock(req.getStock());
        p.setProductType(req.getProductType());
        p.setVisible(req.getVisible());
        p.setImageUrl(req.getImageUrl());

        return repo.save(p);
    }

    @Transactional
    public Product update(Long id, ProductDtos.CreateOrUpdate req) {
        Product p = get(id);
        Category cat = categoryRepo.findById(req.getCategoryId())
                .orElseThrow(() -> new EntityNotFoundException("Category not found: " + req.getCategoryId()));

        p.setCategory(cat);
        p.setName(req.getName());
        p.setDescription(req.getDescription());
        p.setPrice(req.getPrice());
        p.setStock(req.getStock());
        p.setProductType(req.getProductType());
        p.setVisible(req.getVisible());
        p.setImageUrl(req.getImageUrl());

        return repo.save(p);
    }

    @Transactional
    public void delete(Long id) {
        if (!repo.existsById(id))
            throw new EntityNotFoundException("Product not found: " + id);
        repo.deleteById(id);
    }

    @Transactional
    public Product adjustStock(Long id, int delta) {
        Product p = get(id);
        int newStock = p.getStock() + delta;
        if (newStock < 0)
            throw new IllegalArgumentException("Stock cannot be negative");

        p.setStock(newStock);
        return repo.save(p);
    }
}
