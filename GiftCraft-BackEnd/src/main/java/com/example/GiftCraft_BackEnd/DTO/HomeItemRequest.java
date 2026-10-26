package com.example.GiftCraft_BackEnd.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

// what the admin "Home page" form sends
@Data
public class HomeItemRequest {

    @NotBlank
    @Pattern(regexp = "HERO|CATEGORY|BANNER")
    private String type;

    @Size(max = 150)
    private String title;

    @Size(max = 300)
    private String subtitle;

    @Size(max = 60)
    private String buttonText;

    @Size(max = 255)
    private String linkUrl;

    @Size(max = 255)
    private String imageUrl;

    private Integer sortOrder;

    private Boolean active;
}
