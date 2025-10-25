package com.example.GiftCraft_BackEnd.Entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.sql.Timestamp;

@Entity
@Table(name = "PRODUCT")
@Data
@NoArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private Long id;                 // Integer

    @Column(name = "category_id")
    private Long categoryId;

    @Column(name = "name", nullable = false, length = 150)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "price", nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "stock", nullable = false)
    private Integer stock;

    @Column(name = "product_type", nullable = false)
    private String productType;         // 'single' | 'giftbox'

    @Column(name = "created_by")
    private Long createdBy;          // Integer (FK to USER.user_id)

    @Column(name = "visible")
    private String visible;             // 'public' | 'private'

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "created_at", insertable = false, updatable = false)
    private Timestamp createdAt;
}

