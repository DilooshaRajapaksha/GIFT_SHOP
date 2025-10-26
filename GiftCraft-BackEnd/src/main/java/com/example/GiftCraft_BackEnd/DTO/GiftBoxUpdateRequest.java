package com.example.GiftCraft_BackEnd.DTO;

import jakarta.validation.constraints.NotEmpty;
import lombok.*;

import java.util.List;

@Data @NoArgsConstructor @AllArgsConstructor
public class GiftBoxUpdateRequest {
    private String name;                 // optional
    @NotEmpty
    private List<GiftBoxItemDTO> items;
}

