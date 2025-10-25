package com.example.GiftCraft_BackEnd.Repo.Cart;

import com.example.GiftCraft_BackEnd.Entity.Cart.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepo extends JpaRepository<Cart, Integer> {

    Optional<Cart> findByUserId(Long userId);
}
