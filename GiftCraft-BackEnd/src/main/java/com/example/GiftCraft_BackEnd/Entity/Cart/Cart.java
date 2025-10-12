package com.example.GiftCraft_BackEnd.Entity.Cart;

import jakarta.persistence.*;
import lombok.Data;
import java.sql.Timestamp;

@Entity
@Table(name = "CART")
@Data
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cart_id")
    private Integer cartId;

    @Column(name= "user_id" , nullable = false)
    private Integer userId;

    @Column(name= "created_at", insertable = false, updatable = false)
    private Timestamp createdAt;

}
