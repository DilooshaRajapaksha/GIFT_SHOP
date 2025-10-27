
package com.giftcraft.backend.spec;

import com.giftcraft.backend.entity.Product;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

public class ProductSpecifications {
    public static Specification<Product> textSearch(String q) {
        return (root, query, cb) -> {
            if (q == null || q.isBlank()) return cb.conjunction();
            String like = "%" + q.toLowerCase() + "%";
            Predicate byName = cb.like(cb.lower(root.get("name")), like);
            Predicate byDesc = cb.like(cb.lower(root.get("description")), like);
            return cb.or(byName, byDesc);
        };
    }

    public static Specification<Product> hasVisibility(String visibility) {
        return (root, query, cb) -> {
            if (visibility == null || visibility.isBlank()) return cb.conjunction();
            return cb.equal(cb.lower(root.get("visible")), visibility.toLowerCase());
        };
    }

    public static Specification<Product> inCategory(Long categoryId) {
        return (root, query, cb) -> {
            if (categoryId == null) return cb.conjunction();
            return cb.equal(root.get("category").get("id"), categoryId);
        };
    }
}
