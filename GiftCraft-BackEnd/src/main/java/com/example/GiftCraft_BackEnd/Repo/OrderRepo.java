package com.example.GiftCraft_BackEnd.Repo;

import com.example.GiftCraft_BackEnd.Entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OrderRepo extends JpaRepository<Order, Long> {

    // one row per order item (LEFT JOIN so orders without items still show)
    // used by the admin "Orders" page. Column numbers are read in OrderServiceImpl.mapRowsToOrders
    @Query(value = "SELECT o.order_id, o.user_id, o.order_date, o.total_price, o.delivery_address, " +   // 0-4
            "o.delivery_city, o.delivery_postal_code, o.status, " +                                      // 5-7
            "oi.order_item_id, oi.quantity, pr.name AS item_name, oi.unit_price, pr.product_id, " +      // 8-12
            "o.customer_name, o.customer_phone, o.note, pr.product_type " +                               // 13-16
            "FROM `ORDER` o " +
            "LEFT JOIN ORDER_ITEM oi ON o.order_id = oi.order_id " +
            "LEFT JOIN PRODUCT pr ON oi.product_id = pr.product_id " +
            "ORDER BY o.order_date DESC, oi.order_item_id ASC", nativeQuery = true)
    List<Object[]> findAllWithItems();
}
