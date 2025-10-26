package com.example.GiftCraft_BackEnd.Entity.Cart;

import com.example.GiftCraft_BackEnd.Entity.Product;
import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Table(name= "CART_ITEM" , uniqueConstraints = @UniqueConstraint(columnNames = {"cart_id","product_id"}))
@Data
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name= "cart_item_id")
    private Integer cartItemId;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id")
    private Cart cart;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(name= "quantity", nullable = false)
    private Integer quantity;

    @Column(name="unit_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;


}
