package com.example.GiftCraft_BackEnd.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Data @NoArgsConstructor @AllArgsConstructor
public class GiftBoxItemId implements Serializable {
    @Column(name = "giftbox_id")
    private Long giftboxId;     // Integer

    @Column(name = "product_id")
    private Long productId;     // Integer
}
