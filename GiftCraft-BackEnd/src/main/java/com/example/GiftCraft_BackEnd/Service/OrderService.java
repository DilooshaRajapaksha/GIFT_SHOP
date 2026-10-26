package com.example.GiftCraft_BackEnd.Service;

import com.example.GiftCraft_BackEnd.DTO.PlaceOrderRequest;
import com.example.GiftCraft_BackEnd.Entity.Order;

import java.util.List;

public interface OrderService {

    // customer side: save the order, then the frontend opens WhatsApp
    Order placeOrder(PlaceOrderRequest request);

    // admin side
    List<Order> getAllOrders();
    Order getOrder(Long id);
    Order updateStatus(Long id, String status);
    void deleteOrder(Long id);
}
