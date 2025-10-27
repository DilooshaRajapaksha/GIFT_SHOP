
package com.giftcraft.backend.dto;

import com.giftcraft.backend.domain.ProductType;
import com.giftcraft.backend.domain.ProductVisibility;
import jakarta.validation.constraints.*;
import org.hibernate.validator.constraints.URL;
import java.math.BigDecimal;

public class ProductDtos {

    public static class CreateOrUpdate {
        @NotNull
        private Long categoryId;

        @NotBlank @Size(max = 150)
        private String name;

        @Size(max = 5000)
        private String description;

        @NotNull @DecimalMin(value = "0.00")
        private BigDecimal price;

        @NotNull @Min(0)
        private Integer stock;

        @NotNull
        private ProductType productType; // single | giftbox

        @NotNull
        private ProductVisibility visible; // public | private

        @URL(message = "imageUrl must be a valid URL")
        private String imageUrl;

        public Long getCategoryId() { return categoryId; }
        public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public BigDecimal getPrice() { return price; }
        public void setPrice(BigDecimal price) { this.price = price; }
        public Integer getStock() { return stock; }
        public void setStock(Integer stock) { this.stock = stock; }
        public ProductType getProductType() { return productType; }
        public void setProductType(ProductType productType) { this.productType = productType; }
        public ProductVisibility getVisible() { return visible; }
        public void setVisible(ProductVisibility visible) { this.visible = visible; }
        public String getImageUrl() { return imageUrl; }
        public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    }

    public static class Response {
        private Long id;
        private Long categoryId;
        private String categoryName;
        private String name;
        private String description;
        private BigDecimal price;
        private Integer stock;
        private ProductType productType;
        private ProductVisibility visible;
        private String imageUrl;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public Long getCategoryId() { return categoryId; }
        public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
        public String getCategoryName() { return categoryName; }
        public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public BigDecimal getPrice() { return price; }
        public void setPrice(BigDecimal price) { this.price = price; }
        public Integer getStock() { return stock; }
        public void setStock(Integer stock) { this.stock = stock; }
        public ProductType getProductType() { return productType; }
        public void setProductType(ProductType productType) { this.productType = productType; }
        public ProductVisibility getVisible() { return visible; }
        public void setVisible(ProductVisibility visible) { this.visible = visible; }
        public String getImageUrl() { return imageUrl; }
        public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    }
}
