package com.example.GiftCraft_BackEnd.DTO;

import com.example.GiftCraft_BackEnd.Entity.PaymentStatus;
import lombok.Data;

@Data
public class PaymentDTO {
    private Long orderId;
    private String paymentSlipPath;
    private PaymentStatus paymentStatus;
}
