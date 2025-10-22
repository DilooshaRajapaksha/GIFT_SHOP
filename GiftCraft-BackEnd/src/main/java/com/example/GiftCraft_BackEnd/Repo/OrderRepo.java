package com.example.GiftCraft_BackEnd.Repo;

import com.example.GiftCraft_BackEnd.Entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface OrderRepo extends JpaRepository<Order, Long> {

    @Query(value = "SELECT o.order_id, o.user_id, o.order_date, o.total_price, o.delivery_address, " +
            "o.delivery_city, o.delivery_postal_code, o.status, " +
            "p.payment_id, p.payment_slip_path, p.payment_status, p.upload_date, " +
            "oi.order_item_id, oi.quantity, pr.name AS item_name, oi.unit_price, pr.product_id " +
            "FROM `ORDER` o " +
            "LEFT JOIN PAYMENT p ON o.order_id = p.order_id " +
            "LEFT JOIN ORDER_ITEM oi ON o.order_id = oi.order_id " +
            "LEFT JOIN PRODUCT pr ON oi.product_id = pr.product_id " +
            "WHERE o.user_id = :userId " +
            "ORDER BY o.order_date DESC", nativeQuery = true)
    List<Object[]> findByUserIdWithItems(@Param("userId") Long userId);

    @Query(value = "SELECT o.order_id, o.user_id, o.order_date, o.total_price, o.delivery_address, " +
            "o.delivery_city, o.delivery_postal_code, o.status, " +
            "p.payment_id, p.payment_slip_path, p.payment_status, p.upload_date, " +
            "oi.order_item_id, oi.quantity, pr.name AS item_name, oi.unit_price, pr.product_id " +
            "FROM `ORDER` o " +
            "LEFT JOIN PAYMENT p ON o.order_id = p.order_id " +
            "LEFT JOIN ORDER_ITEM oi ON o.order_id = oi.order_id " +
            "LEFT JOIN PRODUCT pr ON oi.product_id = pr.product_id " +
            "ORDER BY o.order_date DESC", nativeQuery = true)
    List<Object[]> findAllWithItems();

    @Query(value = "SELECT o.order_id, o.user_id, o.order_date, o.total_price, o.delivery_address, " +
            "o.delivery_city, o.delivery_postal_code, o.status, " +
            "p.payment_id, p.payment_slip_path, p.payment_status, p.upload_date, " +
            "oi.order_item_id, oi.quantity, pr.name AS item_name, oi.unit_price, pr.product_id " +
            "FROM `ORDER` o " +
            "LEFT JOIN PAYMENT p ON o.order_id = p.order_id " +
            "LEFT JOIN ORDER_ITEM oi ON o.order_id = oi.order_id " +
            "LEFT JOIN PRODUCT pr ON oi.product_id = pr.product_id " +
            "WHERE p.payment_status = :status " +
            "ORDER BY o.order_date DESC", nativeQuery = true)
    List<Object[]> findAllWithItemsByPaymentStatus(@Param("status") String status);
}