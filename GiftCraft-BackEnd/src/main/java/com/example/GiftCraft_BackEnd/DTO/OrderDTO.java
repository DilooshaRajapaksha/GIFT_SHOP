package com.example.GiftCraft_BackEnd.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;
@Data
public class OrderDTO {
    @NotNull
    private Long userId;
    @NotBlank
    private String deliveryAddress;
    private String deliveryCity;
    private String deliveryPostalCode;
    private BigDecimal totalPrice;
    private List<OrderItemDTO> items;
}