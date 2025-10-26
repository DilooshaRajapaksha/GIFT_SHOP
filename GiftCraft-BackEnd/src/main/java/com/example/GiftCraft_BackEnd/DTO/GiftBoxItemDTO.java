package com.example.GiftCraft_BackEnd.DTO;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor
public class GiftBoxItemDTO {
    @NotNull
    private Long productId;      // Integer

    @NotNull @Min(0)
    private Integer quantity;       // 0 means remove in update
}

