package com.example.GiftCraft_BackEnd.DTO;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.List;

@Data @NoArgsConstructor @AllArgsConstructor
public class GiftBoxCreateRequest {
    @NotBlank(message = "Name is required")
    @Size(max = 150)
    private String name;

    @NotEmpty(message = "Gift box must contain at least one item")
    @Size(max = 30, message = "A gift box can have at most 30 different items")
    @Valid
    private List<GiftBoxItemDTO> items;
}
