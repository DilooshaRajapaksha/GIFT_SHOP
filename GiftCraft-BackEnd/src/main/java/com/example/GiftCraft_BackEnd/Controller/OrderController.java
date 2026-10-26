package com.example.GiftCraft_BackEnd.Controller;

import com.example.GiftCraft_BackEnd.DTO.PlaceOrderRequest;
import com.example.GiftCraft_BackEnd.Entity.Order;
import com.example.GiftCraft_BackEnd.Service.OrderService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/*
 * Public order endpoint (customers).
 * There is no login, so customers can ONLY place an order here.
 * Listing / changing orders is in AdminOrderController (needs the admin password),
 * otherwise anyone could read other customers' names, phones and addresses.
 */
@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // returns only what the frontend needs to build the WhatsApp message
    @PostMapping("/place")
    public Map<String, Object> placeOrder(@Valid @RequestBody PlaceOrderRequest request) {
        Order order = orderService.placeOrder(request);
        return Map.of(
                "orderId", order.getOrderId(),
                "totalPrice", order.getTotalPrice()
        );
    }
}
