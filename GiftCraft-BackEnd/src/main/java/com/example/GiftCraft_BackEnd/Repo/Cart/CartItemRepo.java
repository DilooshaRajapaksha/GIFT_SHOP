package com.example.GiftCraft_BackEnd.Repo.Cart;

import com.example.GiftCraft_BackEnd.Entity.Cart.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepo extends JpaRepository<CartItem, Integer> {

    List<CartItem> findByCart_CartIdOrderByCartItemIdAsc(int cartId);
    Optional<CartItem> findByCart_CartIdAndProduct_Id(Integer cartId, Long productId);
    long deleteByCart_CartId(Integer CartId);
    long deleteByCart_CartIdAndProduct_Id(Integer CartId, Integer productId);

}
