package com.example.GiftCraft_BackEnd.DTO;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor
public class GiftBoxItemDTO {
    @NotNull
    private Long productId;

    @NotNull @Min(1) @Max(99)
    private Integer quantity;
}
