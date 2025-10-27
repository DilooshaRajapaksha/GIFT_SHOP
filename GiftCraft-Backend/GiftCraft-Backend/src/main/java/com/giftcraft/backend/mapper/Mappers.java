
package com.giftcraft.backend.mapper;

import com.giftcraft.backend.domain.ProductType;
import com.giftcraft.backend.domain.ProductVisibility;
import com.giftcraft.backend.dto.CategoryCreateUpdateRequest;
import com.giftcraft.backend.dto.ProductDtos;
import com.giftcraft.backend.dto.ReviewDtos;
import com.giftcraft.backend.entity.Category;
import com.giftcraft.backend.entity.Product;
import com.giftcraft.backend.entity.Review;

import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;

public class Mappers {
    private static final DateTimeFormatter ISO = DateTimeFormatter.ISO_INSTANT;

    public static CategoryCreateUpdateRequest.Response category(Category c) {
        return new CategoryCreateUpdateRequest.Response(c.getId(), c.getName());
    }

    public static ProductDtos.Response product(Product p) {
        ProductDtos.Response r = new ProductDtos.Response();
        r.setId(p.getId());
        r.setCategoryId(p.getCategory() != null ? p.getCategory().getId() : null);
        r.setCategoryName(p.getCategory() != null ? p.getCategory().getName() : null);
        r.setName(p.getName());
        r.setDescription(p.getDescription());
        r.setPrice(p.getPrice());
        r.setStock(p.getStock());
        String pt = p.getProductTypeRaw();
        if (pt != null) r.setProductType(ProductType.valueOf(pt));
        String vis = p.getVisibleRaw();
        if (vis != null) r.setVisible("public".equalsIgnoreCase(vis) ? ProductVisibility.public_ : ProductVisibility.private_);
        r.setImageUrl(p.getImageUrl());
        return r;
    }

    public static ReviewDtos.Response review(Review rv) {
        ReviewDtos.Response r = new ReviewDtos.Response();
        r.setId(rv.getId());
        r.setUserId(rv.getUserId());
        r.setProductId(rv.getProduct() != null ? rv.getProduct().getId() : null);
        r.setRating(rv.getRating());
        r.setComment(rv.getComment());
        r.setCreatedAt(rv.getCreatedAt() == null ? null : ISO.format(rv.getCreatedAt().atOffset(ZoneOffset.UTC)));
        return r;
    }
}
