
package com.giftcraft.backend.entity;

import com.giftcraft.backend.domain.ProductType;
import com.giftcraft.backend.domain.ProductVisibility;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "PRODUCT")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @Column(name = "name", nullable = false, length = 150)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "price", nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "stock", nullable = false)
    private Integer stock = 0;

    // We persist as String to match DB VARCHAR(20); expose enums via getters/setters
    @Column(name = "product_type", nullable = false, length = 20)
    private String productType; // 'single' or 'giftbox'

    @Column(name = "created_by")
    private Long createdBy;

    @Column(name = "visible", nullable = false, length = 20)
    private String visible = "public"; // 'public' or 'private'

    @Column(name = "image_url", length = 255)
    private String imageUrl;

    @Column(name = "created_at", updatable = false, insertable = false)
    private Instant createdAt;

    public Product() {}

    // Getters/setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }
    public String getProductTypeRaw() { return productType; }
    public void setProductTypeRaw(String productType) { this.productType = productType; }
    public ProductType getProductType() { return productType == null ? null : ProductType.valueOf(productType); }
    public void setProductType(ProductType type) { this.productType = type == null ? null : type.name(); }
    public Long getCreatedBy() { return createdBy; }
    public void setCreatedBy(Long createdBy) { this.createdBy = createdBy; }
    public String getVisibleRaw() { return visible; }
    public void setVisibleRaw(String visible) { this.visible = visible; }
    public ProductVisibility getVisible() {
        if (visible == null) return null;
        return "public".equalsIgnoreCase(visible) ? ProductVisibility.public_ : ProductVisibility.private_;
    }
    public void setVisible(ProductVisibility v) {
        this.visible = (v == null ? null : (v == ProductVisibility.public_ ? "public" : "private"));
    }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
