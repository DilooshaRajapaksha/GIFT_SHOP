package com.example.GiftCraft_BackEnd.DTO;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

// what the admin "Add / Edit product" form sends
@Data
public class ProductSaveRequest {

    @NotBlank
    @Size(max = 150)
    private String name;

    private String description;

    @NotNull
    @DecimalMin("0.00")
    private BigDecimal price;

    @NotNull
    @Min(0)
    private Integer stock;

    @NotBlank
    @Pattern(regexp = "single|giftbox")
    private String productType;

    @NotBlank
    @Pattern(regexp = "public|private")
    private String visible;

    private Long categoryId;

    @Size(max = 255)
    private String imageUrl;

    private Boolean bestSeller;
}
