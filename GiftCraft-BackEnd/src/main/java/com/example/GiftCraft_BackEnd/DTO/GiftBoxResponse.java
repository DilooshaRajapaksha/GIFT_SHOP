package com.example.GiftCraft_BackEnd.DTO;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GiftBoxResponse {
    private Long id;
    private String name;
    private BigDecimal totalPrice;
    private List<GiftBoxItemInfo> items;

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class GiftBoxItemInfo {
        private Long productId;
        private String productName;
        private Integer quantity;
        private BigDecimal unitPrice;
        private BigDecimal lineTotal;
    }
}

