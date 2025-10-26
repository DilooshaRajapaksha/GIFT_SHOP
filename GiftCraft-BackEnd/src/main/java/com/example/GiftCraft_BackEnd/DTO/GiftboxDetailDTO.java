package com.example.GiftCraft_BackEnd.DTO;


import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;

@Data @AllArgsConstructor
public class GiftboxDetailDTO {
    private Long id;
    private String name;
    private String description;
    private String visible;     // "private" on create
    private String imageUrl;
    private BigDecimal price;   // computed from items
    private Timestamp createdAt;
    private List<GiftboxItemViewDTO> items;
}

