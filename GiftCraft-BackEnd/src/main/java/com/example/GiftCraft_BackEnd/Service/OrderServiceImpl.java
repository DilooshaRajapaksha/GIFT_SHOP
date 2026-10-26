package com.example.GiftCraft_BackEnd.Service;

import com.example.GiftCraft_BackEnd.Config.CurrentUser;
import com.example.GiftCraft_BackEnd.DTO.PlaceOrderRequest;
import com.example.GiftCraft_BackEnd.Entity.Order;
import com.example.GiftCraft_BackEnd.Entity.OrderItem;
import com.example.GiftCraft_BackEnd.Entity.OrderStatus;
import com.example.GiftCraft_BackEnd.Entity.Product;
import com.example.GiftCraft_BackEnd.Repo.OrderRepo;
import com.example.GiftCraft_BackEnd.Repo.ProductRepo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.*;

import static org.springframework.http.HttpStatus.*;

/*
 * Payment by bank slip was removed. Now:
 *   1. customer fills name / phone / address in the cart
 *   2. placeOrder() saves the order here (so the admin can see it)
 *   3. the frontend opens WhatsApp with the order details,
 *      and payment + delivery charge are agreed on WhatsApp
 */
@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepo orderRepository;
    private final ProductRepo productRepo;

    public OrderServiceImpl(OrderRepo orderRepository, ProductRepo productRepo) {
        this.orderRepository = orderRepository;
        this.productRepo = productRepo;
    }

    @Override
    @Transactional
    public Order placeOrder(PlaceOrderRequest req) {
        Order order = new Order();
        order.setUserId(CurrentUser.id());
        order.setCustomerName(req.getCustomerName().trim());
        order.setCustomerPhone(req.getCustomerPhone().trim());
        order.setDeliveryAddress(req.getDeliveryAddress().trim());
        order.setDeliveryCity(req.getDeliveryCity() != null ? req.getDeliveryCity().trim() : "");
        order.setDeliveryPostalCode("");
        order.setNote(req.getNote() != null ? req.getNote().trim() : null);
        order.setStatus(OrderStatus.Pending);
        order.setOrderDate(LocalDateTime.now());

        // if the same product is sent twice, add the quantities together
        Map<Long, Integer> qtyByProduct = new LinkedHashMap<>();
        for (PlaceOrderRequest.Line line : req.getItems()) {
            qtyByProduct.merge(line.getProductId(), line.getQuantity(), Integer::sum);
        }

        List<OrderItem> items = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (Map.Entry<Long, Integer> entry : qtyByProduct.entrySet()) {
            Product p = productRepo.findById(entry.getKey())
                    .orElseThrow(() -> new ResponseStatusException(NOT_FOUND,
                            "Product " + entry.getKey() + " no longer exists. Please remove it from your cart."));
            int qty = entry.getValue();

            // stock is only tracked for single items (gift boxes are made to order)
            if ("single".equalsIgnoreCase(p.getProductType()) && qty > p.getStock()) {
                throw new ResponseStatusException(CONFLICT, "Only " + p.getStock() + " left for " + p.getName());
            }

            OrderItem item = new OrderItem();
            item.setProductId(p.getId());
            item.setQuantity(qty);
            item.setUnitPrice(p.getPrice());   // price from the database, not from the browser
            item.setName(p.getName());
            item.setOrder(order);
            items.add(item);

            total = total.add(p.getPrice().multiply(BigDecimal.valueOf(qty)));
        }

        order.setItems(items);
        order.setTotalPrice(total);   // delivery charge is agreed on WhatsApp
        return orderRepository.save(order);
    }

    @Override
    public List<Order> getAllOrders() {
        return mapRowsToOrders(orderRepository.findAllWithItems());
    }

    /*
     * Turns the rows from the native join query (order + items) into Order objects.
     * One order can come back as many rows (one per item), so we group them by order id.
     * LinkedHashMap keeps the newest-first order from the SQL.
     */
    private List<Order> mapRowsToOrders(List<Object[]> rawData) {
        Map<Long, Order> orderMap = new LinkedHashMap<>();

        for (Object[] row : rawData) {
            Long orderId = row[0] != null ? ((Number) row[0]).longValue() : null;
            if (orderId == null) {
                continue;
            }

            Order order = orderMap.get(orderId);
            if (order == null) {
                order = new Order();
                order.setOrderId(orderId);
                order.setUserId(row[1] != null ? ((Number) row[1]).longValue() : null);
                order.setOrderDate(toDateTime(row[2]));
                order.setTotalPrice(row[3] != null ? new BigDecimal(row[3].toString()) : BigDecimal.ZERO);
                order.setDeliveryAddress((String) row[4]);
                order.setDeliveryCity((String) row[5]);
                order.setDeliveryPostalCode((String) row[6]);
                String statusStr = (String) row[7];
                order.setStatus(statusStr != null ? OrderStatus.valueOf(statusStr) : null);
                order.setCustomerName((String) row[13]);
                order.setCustomerPhone((String) row[14]);
                order.setNote((String) row[15]);
                order.setItems(new ArrayList<>());
                orderMap.put(orderId, order);
            }

            if (row[8] != null) {
                OrderItem item = new OrderItem();
                item.setOrderItemId(((Number) row[8]).longValue());
                item.setQuantity(row[9] != null ? ((Number) row[9]).intValue() : 0);
                item.setName(row[10] != null ? (String) row[10] : "(deleted product)");
                item.setUnitPrice(row[11] != null ? new BigDecimal(row[11].toString()) : BigDecimal.ZERO);
                item.setProductId(row[12] != null ? ((Number) row[12]).longValue() : null);
                item.setProductType((String) row[16]);
                item.setOrder(order);
                order.getItems().add(item);
            }
        }
        return new ArrayList<>(orderMap.values());
    }

    // MySQL gives a Timestamp, some drivers give LocalDateTime - handle both
    private LocalDateTime toDateTime(Object value) {
        if (value instanceof Timestamp ts) {
            return ts.toLocalDateTime();
        }
        if (value instanceof LocalDateTime ldt) {
            return ldt;
        }
        return null;
    }

    @Override
    public Order getOrder(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Order not found"));
    }

    @Override
    public Order updateStatus(Long id, String status) {
        Order order = getOrder(id);
        try {
            order.setStatus(OrderStatus.valueOf(status));
        } catch (IllegalArgumentException | NullPointerException e) {
            throw new ResponseStatusException(BAD_REQUEST,
                    "Unknown status '" + status + "'. Use one of " + Arrays.toString(OrderStatus.values()));
        }
        return orderRepository.save(order);
    }

    @Override
    public void deleteOrder(Long id) {
        if (!orderRepository.existsById(id)) {
            throw new ResponseStatusException(NOT_FOUND, "Order not found");
        }
        orderRepository.deleteById(id);
    }
}
