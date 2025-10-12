package com.example.GiftCraft_BackEnd.DTO.CartResponse;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartResponse {

    private Integer cartId;
    private Integer userId;
    private List<CartItemResponse> items;
    private Integer totalItems;
    private BigDecimal subtotal;


    @Data
    @NoArgsConstructor
    @AllArgsConstructor
     public static class CartItemResponse {

         private Integer productId;
         private String name;
         private String productType;
         private Integer quantity;
         private BigDecimal unitPrice;
         private BigDecimal lineTotal;
         private String imageUrl;
     }
}
