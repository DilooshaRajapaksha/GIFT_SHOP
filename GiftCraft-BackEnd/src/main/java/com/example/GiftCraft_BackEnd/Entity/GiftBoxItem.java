package com.example.GiftCraft_BackEnd.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "GIFTBOX_PRODUCT")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GiftBoxItem {

    @EmbeddedId
    private GiftBoxItemId id = new GiftBoxItemId();

    @ManyToOne(fetch = FetchType.LAZY) @MapsId("giftboxId")
    @JoinColumn(name = "giftbox_id", nullable = false)
    private Product giftbox;

    @ManyToOne(fetch = FetchType.LAZY) @MapsId("productId")
    @JoinColumn(name = "product_id", nullable = false)
    private Product item;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;
}
