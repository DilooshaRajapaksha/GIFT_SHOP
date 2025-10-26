package com.example.GiftCraft_BackEnd.Service;

import com.example.GiftCraft_BackEnd.DTO.OrderDTO;
import com.example.GiftCraft_BackEnd.DTO.OrderItemDTO;
import com.example.GiftCraft_BackEnd.Entity.*;
import com.example.GiftCraft_BackEnd.Repo.OrderRepo;
import com.example.GiftCraft_BackEnd.Repo.PaymentRepo;
import jakarta.annotation.Nullable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepo orderRepository;
    private final PaymentRepo paymentRepository;

    public OrderServiceImpl(OrderRepo orderRepository, PaymentRepo paymentRepository) {
        this.orderRepository = orderRepository;
        this.paymentRepository = paymentRepository;
    }

    @Override
    public List<Order> getOrdersByUser(Long id) {
        List<Object[]> rawData = orderRepository.findByUserIdWithItems(id);
        Map<Long, Order> orderMap = new HashMap<>();
        for (Object[] row : rawData) {
            Long orderId = row[0] != null ? ((Number) row[0]).longValue() : null;
            if (orderId == null || orderMap.containsKey(orderId)) {
                continue;
            }
            Order order = new Order();
            order.setOrderId(orderId);
            order.setUserId(row[1] != null ? ((Number) row[1]).longValue() : null);
            if (row[2] != null) {
                Timestamp ts = (Timestamp) row[2];
                order.setOrderDate(ts.toLocalDateTime());
            }
            order.setTotalPrice(row[3] != null ? new BigDecimal(row[3].toString()) : BigDecimal.ZERO);
            order.setDeliveryAddress((String) row[4]);
            order.setDeliveryCity((String) row[5]);
            order.setDeliveryPostalCode((String) row[6]);
            String statusStr = (String) row[7];
            order.setStatus(statusStr != null ? OrderStatus.valueOf(statusStr) : null);
            Payment payment = null;
            if (row[8] != null) {
                payment = new Payment();
                payment.setPaymentId(((Number) row[8]).longValue());
                payment.setPaymentSlipPath((String) row[9]);
                String psStr = (String) row[10];
                payment.setPaymentStatus(psStr != null ? PaymentStatus.valueOf(psStr) : null);
                if (row[11] != null) {
                    Timestamp pts = (Timestamp) row[11];
                    payment.setUploadDate(pts.toLocalDateTime());
                }
                payment.setOrder(order);
                order.setPayment(payment);
            }
            order.setItems(new ArrayList<>());
            orderMap.put(orderId, order);
        }
        for (Object[] row : rawData) {
            Long orderId = row[0] != null ? ((Number) row[0]).longValue() : null;
            if (orderId == null || !orderMap.containsKey(orderId)) {
                continue;
            }
            if (row.length > 12 && row[12] != null) {
                OrderItem item = new OrderItem();
                item.setOrderItemId(((Number) row[12]).longValue());
                item.setQuantity(row[13] != null ? ((Number) row[13]).intValue() : 0);
                item.setName((String) row[14]);
                item.setUnitPrice(row[15] != null ? new BigDecimal(row[15].toString()) : BigDecimal.ZERO);
                item.setProductId(row[16] != null ? ((Number) row[16]).longValue() : null);
                item.setOrder(orderMap.get(orderId));
                orderMap.get(orderId).getItems().add(item);
            }
        }
        List<Order> orders = new ArrayList<>(orderMap.values());
        return orders;
    }

    @Override
    public List<Order> getAllOrders(@Nullable String paymentStatus) {
        List<Object[]> rawData;
        if (paymentStatus != null) {
            rawData = orderRepository.findAllWithItemsByPaymentStatus(paymentStatus);
        } else {
            rawData = orderRepository.findAllWithItems();
        }
        Map<Long, Order> orderMap = new HashMap<>();
        for (Object[] row : rawData) {
            Long orderId = row[0] != null ? ((Number) row[0]).longValue() : null;
            if (orderId == null || orderMap.containsKey(orderId)) {
                continue;
            }
            Order order = new Order();
            order.setOrderId(orderId);
            order.setUserId(row[1] != null ? ((Number) row[1]).longValue() : null);
            if (row[2] != null) {
                Timestamp ts = (Timestamp) row[2];
                order.setOrderDate(ts.toLocalDateTime());
            }
            order.setTotalPrice(row[3] != null ? new BigDecimal(row[3].toString()) : BigDecimal.ZERO);
            order.setDeliveryAddress((String) row[4]);
            order.setDeliveryCity((String) row[5]);
            order.setDeliveryPostalCode((String) row[6]);
            String statusStr = (String) row[7];
            order.setStatus(statusStr != null ? OrderStatus.valueOf(statusStr) : null);
            Payment payment = null;
            if (row[8] != null) {
                payment = new Payment();
                payment.setPaymentId(((Number) row[8]).longValue());
                payment.setPaymentSlipPath((String) row[9]);
                String psStr = (String) row[10];
                payment.setPaymentStatus(psStr != null ? PaymentStatus.valueOf(psStr) : null);
                if (row[11] != null) {
                    Timestamp pts = (Timestamp) row[11];
                    payment.setUploadDate(pts.toLocalDateTime());
                }
                payment.setOrder(order);
                order.setPayment(payment);
            }
            order.setItems(new ArrayList<>());
            orderMap.put(orderId, order);
        }
        for (Object[] row : rawData) {
            Long orderId = row[0] != null ? ((Number) row[0]).longValue() : null;
            if (orderId == null || !orderMap.containsKey(orderId)) {
                continue;
            }
            if (row.length > 12 && row[12] != null) {
                OrderItem item = new OrderItem();
                item.setOrderItemId(((Number) row[12]).longValue());
                item.setQuantity(row[13] != null ? ((Number) row[13]).intValue() : 0);
                item.setName((String) row[14]);
                item.setUnitPrice(row[15] != null ? new BigDecimal(row[15].toString()) : BigDecimal.ZERO);
                item.setProductId(row[16] != null ? ((Number) row[16]).longValue() : null);
                item.setOrder(orderMap.get(orderId));
                orderMap.get(orderId).getItems().add(item);
            }
        }
        List<Order> orders = new ArrayList<>(orderMap.values());
        return orders;
    }

    @Override
    public Order createOrder(OrderDTO dto) {
        Order order = new Order();
        order.setUserId(dto.getUserId());
        order.setDeliveryAddress(dto.getDeliveryAddress());
        order.setDeliveryCity(dto.getDeliveryCity() != null ? dto.getDeliveryCity() : "");
        order.setDeliveryPostalCode(dto.getDeliveryPostalCode() != null ? dto.getDeliveryPostalCode() : "");
        order.setTotalPrice(dto.getTotalPrice() != null ? dto.getTotalPrice() : BigDecimal.ZERO);
        order.setStatus(OrderStatus.Pending);
        order.setOrderDate(LocalDateTime.now());
        List<OrderItem> items = new ArrayList<>();
        if (dto.getItems() != null) {
            for (OrderItemDTO itemDto : dto.getItems()) {
                OrderItem item = new OrderItem();
                item.setProductId(itemDto.getProductId());
                item.setQuantity(itemDto.getQuantity());
                item.setUnitPrice(itemDto.getUnitPrice());
                item.setOrder(order);
                items.add(item);
            }
        }
        order.setItems(items);
        return orderRepository.save(order);
    }

    @Override
    public Order getOrder(Long id) {
        return orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
    }

    @Override
    public Order updateStatus(Long id, String status) {
        Order order = getOrder(id);
        order.setStatus(OrderStatus.valueOf(status));
        return orderRepository.save(order);
    }

    @Override
    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }

    @Override
    public Order updateOrder(Long id, OrderDTO dto) {
        Order order = getOrder(id);
        order.setDeliveryAddress(dto.getDeliveryAddress());
        order.setDeliveryCity(dto.getDeliveryCity() != null ? dto.getDeliveryCity() : "");
        order.setDeliveryPostalCode(dto.getDeliveryPostalCode() != null ? dto.getDeliveryPostalCode() : "");
        if (dto.getTotalPrice() != null) {
            order.setTotalPrice(dto.getTotalPrice());
        }
        return orderRepository.save(order);
    }

    @Override
    public Order addItemToOrder(Long id, OrderItemDTO itemDto) {
        Order order = getOrder(id);
        OrderItem item = new OrderItem();
        item.setProductId(itemDto.getProductId());
        item.setQuantity(itemDto.getQuantity());
        item.setUnitPrice(itemDto.getUnitPrice());
        item.setOrder(order);
        order.getItems().add(item);
        return orderRepository.save(order);
    }

    @Override
    public String savePaymentSlip(Long id, MultipartFile slip) {
        if (slip.isEmpty()) {
            throw new RuntimeException("Slip file is empty");
        }
        try {
            String uploadDir = System.getProperty("user.dir") + "/src/main/resources/static/payments/";
            File uploadDirFile = new File(uploadDir);
            if (!uploadDirFile.exists()) {
                uploadDirFile.mkdirs();
            }
            String fileName = id + "_" + System.currentTimeMillis() + "_" + slip.getOriginalFilename();
            File file = new File(uploadDir, fileName);
            slip.transferTo(file);
            return "/payments/" + fileName;
        } catch (Exception e) {
            throw new RuntimeException("Could not save file: " + e.getMessage());
        }
    }

    @Override
    public void createPayment(Long id, String slipPath) {
        Order order = getOrder(id);
        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setPaymentSlipPath(slipPath);
        payment.setPaymentStatus(PaymentStatus.PENDING);
        payment.setUploadDate(LocalDateTime.now());
        paymentRepository.save(payment);
    }

    @Override
    public void updatePaymentStatus(Long id, PaymentStatus status) {
        Payment payment = paymentRepository.findByOrder_OrderId(id).orElseThrow(() -> new RuntimeException("Payment not found"));
        payment.setPaymentStatus(status);
        paymentRepository.save(payment);
    }

    @Override
    public Order createOrderFromCart(OrderDTO dto) {
        return createOrder(dto);
    }

    @Override
    public Order payOrder(Long id, BigDecimal amount) {
        Order order = getOrder(id);
        if (!order.getTotalPrice().equals(amount)) {
            throw new RuntimeException("Payment amount does not match order total");
        }
        return order;
    }
}