package com.example.GiftCraft_BackEnd.DTO.CartRequest;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @AllArgsConstructor @NoArgsConstructor
public class UpdateCartQtyRequest {

    @NotNull
    private Long productId;

    @NotNull @Min(0)
    private Integer quantity;
}
