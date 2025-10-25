package com.example.GiftCraft_BackEnd.Services;

import com.example.GiftCraft_BackEnd.DTO.CartRequest.AddToCartRequest;
import com.example.GiftCraft_BackEnd.DTO.CartRequest.UpdateCartQtyRequest;
import com.example.GiftCraft_BackEnd.DTO.CartResponse.CartResponse;
import com.example.GiftCraft_BackEnd.Entity.Cart.Cart;
import com.example.GiftCraft_BackEnd.Entity.Cart.CartItem;
import com.example.GiftCraft_BackEnd.Entity.Product;
import com.example.GiftCraft_BackEnd.Repo.Cart.CartItemRepo;
import com.example.GiftCraft_BackEnd.Repo.Cart.CartRepo;
import com.example.GiftCraft_BackEnd.Repo.ProductRepo;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import static org.springframework.http.HttpStatus.*;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepo cartRepo;
    private final CartItemRepo cartItemRepo;
    private final ProductRepo productRepo;

    private Long currentUserId() {return 1L;}

    @Transactional
    public CartResponse createCart() {
        Long userId = currentUserId();
        cartRepo.findByUserId(userId).ifPresent(c -> {
            throw new ResponseStatusException(CONFLICT, "Cart already exists for user");
        });
        Cart c = new Cart();
        c.setUserId(userId);
        cartRepo.save(c);
        return toResponse(c, List.of());
    }

     public CartResponse getMyCart() {
        Cart cart = requireCartForUser(currentUserId());
        List<CartItem> lines = cartItemRepo.findByCart_CartIdOrderByCartItemIdAsc(cart.getCartId());
        return toResponse(cart, lines);
      }

    // ---- Item operations ----

    /** Add = upsert (increment). Snapshot price at add time; validate stock only for singles. */
    @Transactional
    public CartResponse addToCart(AddToCartRequest req) {
        if (req.getQuantity() == null || req.getQuantity() < 1)
            throw new ResponseStatusException(BAD_REQUEST, "Quantity must be >= 1");

        Cart cart = requireCartForUser(currentUserId());

        Product p = productRepo.findById(req.getProductId())
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Product not found"));

        // Stock check only for single items
        if ("single".equalsIgnoreCase(p.getProductType()) && req.getQuantity() > p.getStock()) {
            throw new ResponseStatusException(CONFLICT, "Only " + p.getStock() + " left for " + p.getName());
        }

        CartItem line = cartItemRepo.findByCart_CartIdAndProduct_Id(cart.getCartId(), p.getId())
                .orElseGet(() -> {
                    CartItem n = new CartItem();
                    n.setCart(cart);
                    n.setProduct(p);
                    n.setQuantity(0);
                    n.setUnitPrice(p.getPrice()); // snapshot current price
                    return n;
                });

        line.setQuantity(line.getQuantity() + req.getQuantity());
        cartItemRepo.save(line);

        List<CartItem> lines = cartItemRepo.findByCart_CartIdOrderByCartItemIdAsc(cart.getCartId());
        return toResponse(cart, lines);
    }

    /** Set new quantity; 0 = remove line */
    @Transactional
    public CartResponse updateQty(UpdateCartQtyRequest req) {
        Cart cart = requireCartForUser(currentUserId());
        CartItem line = cartItemRepo.findByCart_CartIdAndProduct_Id(cart.getCartId(), req.getProductId())
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Item not in cart"));

        if (req.getQuantity() == 0) {
            cartItemRepo.delete(line);
        } else {
            // Validate again for singles at the new target quantity
            Product p = productRepo.findById(req.getProductId())
                    .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Product not found"));
            if ("single".equalsIgnoreCase(p.getProductType()) && req.getQuantity() > p.getStock()) {
                throw new ResponseStatusException(CONFLICT, "Only " + p.getStock() + " left for " + p.getName());
            }
            line.setQuantity(req.getQuantity());
            cartItemRepo.save(line);
        }

        List<CartItem> lines = cartItemRepo.findByCart_CartIdOrderByCartItemIdAsc(cart.getCartId());
        return toResponse(cart, lines);
    }

    /** Remove a single product from cart */
    @Transactional
    public CartResponse removeItem(Integer productId) {
        Cart cart = requireCartForUser(currentUserId());
        cartItemRepo.deleteByCart_CartIdAndProduct_Id(cart.getCartId(), productId);
        List<CartItem> lines = cartItemRepo.findByCart_CartIdOrderByCartItemIdAsc(cart.getCartId());
        return toResponse(cart, lines);
    }

    /** Clear all items */
    @Transactional
    public CartResponse clearCart() {
        Cart cart = requireCartForUser(currentUserId());
        cartItemRepo.deleteByCart_CartId(cart.getCartId());
        return toResponse(cart, List.of());
    }


         //Helpers
         private Cart requireCartForUser(Long userId) {
            return cartRepo.findByUserId(userId)
                    .orElseThrow( () -> new ResponseStatusException(NOT_FOUND, "Cart not found for user"));
         }

         private CartResponse toResponse (Cart cart, List < CartItem > lines){
             List<CartResponse.CartItemResponse> out = new ArrayList<>();
             BigDecimal subtotal = BigDecimal.ZERO;
             int totalQty = 0;

             for (CartItem li : lines) {
                 Product p = productRepo.findById(li.getProduct().getId())
                         .orElseThrow(EntityNotFoundException::new); // should not happen unless data is broken

                 BigDecimal lineTotal = li.getUnitPrice().multiply(BigDecimal.valueOf(li.getQuantity()));
                 subtotal = subtotal.add(lineTotal);
                 totalQty += li.getQuantity();

                 out.add(new CartResponse.CartItemResponse(
                         p.getId(),
                         p.getName(),
                         p.getProductType(),
                         li.getQuantity(),
                         li.getUnitPrice(),
                         lineTotal,
                         p.getImageUrl()
                 ));
             }

             return new CartResponse(cart.getCartId(), cart.getUserId(), out, totalQty, subtotal);
         }


}
