package com.example.GiftCraft_BackEnd.Controller;

import com.example.GiftCraft_BackEnd.DTO.CartRequest.AddToCartRequest;
import com.example.GiftCraft_BackEnd.DTO.CartRequest.UpdateCartQtyRequest;
import com.example.GiftCraft_BackEnd.DTO.CartResponse.CartResponse;
import com.example.GiftCraft_BackEnd.Services.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.apache.catalina.Service;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequiredArgsConstructor
@RequestMapping("/api/v1/cart")
public class CartController {

    private final CartService service;

    @PostMapping("/create")
    public CartResponse create() {
        return service.createCart();
    }

    // get my cart
    @GetMapping
    public CartResponse get() {
        return service.getMyCart();
    }

    // add = upsert (increment qty if exists)
    @PostMapping("/items")
    public CartResponse add(@Valid @RequestBody AddToCartRequest body) {
        return service.addToCart(body);
    }

    // set quantity (0 = remove)
    @PutMapping("/items")
    public CartResponse setQuantity(@Valid @RequestBody UpdateCartQtyRequest body) {
        return service.updateQty(body);
    }

    // remove one product line
    @DeleteMapping("/items/{productId}")
    public CartResponse remove(@PathVariable Integer productId) {
        return service.removeItem(productId);
    }

    // clear all
    @DeleteMapping("/clear")
    public CartResponse clear() {
        return service.clearCart();
    }
}
