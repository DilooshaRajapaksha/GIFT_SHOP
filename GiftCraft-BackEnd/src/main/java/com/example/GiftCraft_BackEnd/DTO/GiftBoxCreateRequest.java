package com.example.GiftCraft_BackEnd.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;

import java.util.List;

@Data @NoArgsConstructor @AllArgsConstructor
public class GiftBoxCreateRequest {
    @NotBlank(message = "Name is required")
    private String name;

    @NotEmpty(message = "Gift box must contain at least one item")
    private List<GiftBoxItemDTO> items;
}

