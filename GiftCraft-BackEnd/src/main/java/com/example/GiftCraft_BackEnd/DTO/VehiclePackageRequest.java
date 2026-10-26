package com.example.GiftCraft_BackEnd.DTO;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

// what the admin "Vehicle surprise" form sends
@Data
public class VehiclePackageRequest {

    @NotBlank
    @Size(max = 150)
    private String name;

    @Size(max = 3000)
    private String description;

    @Size(max = 3000)
    private String includes;

    @DecimalMin("0.00")
    private BigDecimal price;     // can be empty = "price on request"

    private Integer sortOrder;

    private Boolean active;

    @Size(max = 8, message = "you can add up to 8 photos")
    private List<@Size(max = 255) String> images;
}
