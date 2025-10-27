
package com.giftcraft.backend.service;

import com.giftcraft.backend.dto.CategoryCreateUpdateRequest;
import com.giftcraft.backend.entity.Category;
import com.giftcraft.backend.repository.CategoryRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CategoryService {
    private final CategoryRepository repo;
    public CategoryService(CategoryRepository repo) { this.repo = repo; }

    public List<Category> list() { return repo.findAll(); }

    @Transactional
    public Category create(CategoryCreateUpdateRequest req) {
        repo.findByNameIgnoreCase(req.getName()).ifPresent(c -> {
            throw new IllegalArgumentException("Category name already exists: " + req.getName());
        });
        Category c = new Category(req.getName());
        return repo.save(c);
    }

    @Transactional
    public Category update(Long id, CategoryCreateUpdateRequest req) {
        Category c = repo.findById(id).orElseThrow(() -> new EntityNotFoundException("Category not found: " + id));
        if (!c.getName().equalsIgnoreCase(req.getName())) {
            repo.findByNameIgnoreCase(req.getName()).ifPresent(existing -> {
                if (!existing.getId().equals(id)) {
                    throw new IllegalArgumentException("Category name already exists: " + req.getName());
                }
            });
        }
        c.setName(req.getName());
        return repo.save(c);
    }

    @Transactional
    public void delete(Long id) {
        if (!repo.existsById(id)) throw new EntityNotFoundException("Category not found: " + id);
        repo.deleteById(id);
    }

    public Category get(Long id) {
        return repo.findById(id).orElseThrow(() -> new EntityNotFoundException("Category not found: " + id));
    }
}
