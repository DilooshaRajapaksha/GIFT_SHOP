package com.example.GiftCraft_BackEnd.Controller;

import com.example.GiftCraft_BackEnd.DTO.OrderDTO;
import com.example.GiftCraft_BackEnd.DTO.OrderItemDTO;
import com.example.GiftCraft_BackEnd.DTO.StatusDTO;
import com.example.GiftCraft_BackEnd.Entity.Order;
import com.example.GiftCraft_BackEnd.Entity.PaymentStatus;
import com.example.GiftCraft_BackEnd.Service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.util.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public Order create(@Valid @RequestBody OrderDTO dto) {
        return orderService.createOrder(dto);
    }

    @GetMapping
    public ResponseEntity<?> getAll(@RequestParam(required = false) String paymentStatus) {
        try {
            return ResponseEntity.ok(orderService.getAllOrders(paymentStatus));
        } catch (Exception e) {
            return ResponseEntity.ok(new ArrayList<>());
        }
    }

    @GetMapping("/{id}")
    public Order getOne(@PathVariable Long id) {
        return orderService.getOrder(id);
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<List<Order>> getOrdersByUser(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(orderService.getOrdersByUser(id));
        } catch (Exception e) {
            return ResponseEntity.ok(new ArrayList<>());
        }
    }

    @PutMapping("/{id}/status")
    public Order updateStatus(@PathVariable Long id, @Valid @RequestBody StatusDTO dto) {
        return orderService.updateStatus(id, dto.getStatus());
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        orderService.deleteOrder(id);
    }

    @PutMapping("/{id}")
    public Order updateOrder(@PathVariable Long id, @Valid @RequestBody OrderDTO dto) {
        return orderService.updateOrder(id, dto);
    }

    @PostMapping("/{id}/item")
    public Order addItemToOrder(@PathVariable Long id, @Valid @RequestBody OrderItemDTO itemDto) {
        return orderService.addItemToOrder(id, itemDto);
    }

    @PostMapping(value = "/{id}/pay", consumes = "multipart/form-data")
    public Order payOrder(@PathVariable Long id,
                          @RequestParam("amount") BigDecimal amount,
                          @RequestParam("slip") MultipartFile slip) {
        Order order = orderService.getOrder(id);
        if (!order.getTotalPrice().equals(amount)) {
            throw new RuntimeException("Payment amount does not match order total of Rs " + order.getTotalPrice());
        }
        String slipPath = orderService.savePaymentSlip(id, slip);
        orderService.createPayment(id, slipPath);
        return order;
    }

    @PutMapping("/{id}/payment/status")
    public Order updatePaymentStatus(@PathVariable Long id, @RequestParam PaymentStatus status) {
        orderService.updatePaymentStatus(id, status);
        return orderService.getOrder(id);
    }

    @PostMapping("/create-from-cart")
    public Order createOrderFromCart(@Valid @RequestBody OrderDTO dto)   {
        return orderService.createOrderFromCart(dto);
    }
}