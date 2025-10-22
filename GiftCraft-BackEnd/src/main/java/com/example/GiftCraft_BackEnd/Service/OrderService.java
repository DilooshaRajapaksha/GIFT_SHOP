package com.example.GiftCraft_BackEnd.Service;

import com.example.GiftCraft_BackEnd.DTO.OrderDTO;
import com.example.GiftCraft_BackEnd.DTO.OrderItemDTO;
import com.example.GiftCraft_BackEnd.DTO.StatusDTO;
import com.example.GiftCraft_BackEnd.Entity.Order;
import com.example.GiftCraft_BackEnd.Entity.PaymentStatus;
import org.springframework.lang.Nullable;
import org.springframework.web.multipart.MultipartFile;
import java.math.BigDecimal;
import java.util.List;

public interface OrderService {
    Order createOrder(OrderDTO dto);
    List<Order> getAllOrders(@Nullable String paymentStatus);
    Order getOrder(Long id);
    List<Order> getOrdersByUser(Long id);
    Order updateStatus(Long id, String status);
    void deleteOrder(Long id);
    Order updateOrder(Long id, OrderDTO dto);
    Order addItemToOrder(Long id, OrderItemDTO itemDto);
    String savePaymentSlip(Long id, MultipartFile slip);
    void createPayment(Long id, String slipPath);
    void updatePaymentStatus(Long id, PaymentStatus status);
    Order createOrderFromCart(OrderDTO dto);
    Order payOrder(Long id, BigDecimal amount);
}