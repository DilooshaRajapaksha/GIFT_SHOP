package com.example.GiftCraft_BackEnd.Controller;

import com.example.GiftCraft_BackEnd.DTO.StatusDTO;
import com.example.GiftCraft_BackEnd.Entity.Order;
import com.example.GiftCraft_BackEnd.Service.OrderService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// admin: see all WhatsApp orders and change their status
@RestController
@RequestMapping("/api/v1/admin/orders")
public class AdminOrderController {

    private final OrderService orderService;

    public AdminOrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public List<Order> list() {
        return orderService.getAllOrders();
    }

    @PutMapping("/{id}/status")
    public void updateStatus(@PathVariable Long id, @Valid @RequestBody StatusDTO dto) {
        orderService.updateStatus(id, dto.getStatus());
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        orderService.deleteOrder(id);
    }
}
