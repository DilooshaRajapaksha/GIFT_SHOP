package com.example.GiftCraft_BackEnd.DTO;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

/*
 * What the Cart page sends when the customer clicks "Place Order on WhatsApp".
 * We only take product ids + quantities from the browser.
 * Prices are always read from the database (so nobody can change the price in the browser).
 */
@Data
public class PlaceOrderRequest {

    @NotBlank
    @Size(max = 100)
    private String customerName;

    @NotBlank
    @Pattern(regexp = "^[0-9+\\s-]{9,15}$", message = "must be a valid phone number")
    private String customerPhone;

    @NotBlank
    @Size(max = 255)
    private String deliveryAddress;

    @Size(max = 100)
    private String deliveryCity;

    @Size(max = 500)
    private String note;

    @NotEmpty
    @Size(max = 50)
    @Valid
    private List<Line> items;

    @Data
    public static class Line {
        @NotNull
        private Long productId;

        @NotNull
        @Min(1)
        @Max(99)
        private Integer quantity;
    }
}
