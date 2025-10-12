package com.example.GiftCraft_BackEnd.Repo;

import com.example.GiftCraft_BackEnd.Entity.GiftBoxItem;
import com.example.GiftCraft_BackEnd.Entity.GiftBoxItemId;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface GiftBoxItemRepo extends JpaRepository<GiftBoxItem, GiftBoxItemId> {

    List<GiftBoxItem> findByGiftbox_Id(Integer giftboxId);

    @Query("""
    select coalesce(sum(li.item.price * li.quantity), 0)
    from GiftBoxItem li
    where li.giftbox.id = :giftboxId
  """)
    BigDecimal sumTotal(@Param("giftboxId") Integer giftboxId);

    @Modifying
    @Query(value = """
    insert into GIFTBOX_PRODUCT (giftbox_id, product_id, quantity)
    values (?1, ?2, ?3)
    on duplicate key update quantity = values(quantity)
  """, nativeQuery = true)
    void upsertLine(Integer giftboxId, Integer productId, Integer qty);

    @Modifying
    @Query(value = "delete from GIFTBOX_PRODUCT where giftbox_id=?1 and product_id=?2", nativeQuery = true)
    void deleteLine(Integer giftboxId, Integer productId);
}

