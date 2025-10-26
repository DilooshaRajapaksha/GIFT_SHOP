package com.example.GiftCraft_BackEnd.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.List;

@Data
public class GiftboxCreateDTO {
    @NotBlank private String name;
    private String description;
    private String imageUrl;
    @NotNull  private List<GiftBoxItemDTO> items; // only 'single' products allowed
}

