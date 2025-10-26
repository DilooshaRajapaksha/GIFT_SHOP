package com.example.GiftCraft_BackEnd.Repo;

import com.example.GiftCraft_BackEnd.Entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PaymentRepo extends JpaRepository<Payment, Long>{
    Optional<Payment> findByOrder_OrderId(Long orderId);
}
