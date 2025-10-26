package com.example.GiftCraft_BackEnd.DTO;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;


@Data
public class OrderItemDTO {
    @NotNull
    private Long productId;
    @NotNull
    @Min(1)
    private Integer quantity;
    @NotNull
    private BigDecimal unitPrice;
}
