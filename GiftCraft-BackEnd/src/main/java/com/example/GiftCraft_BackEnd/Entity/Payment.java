package com.example.GiftCraft_BackEnd.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "PAYMENT")
@Data
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Payment {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "payment_id")
        private Long paymentId;

        @OneToOne
        @JoinColumn(name = "order_id")
        @JsonBackReference
        private Order  order;

        @Column(name = "payment_slip_path", length = 255)
        private String paymentSlipPath;

        @Enumerated(EnumType.STRING)
        @Column(name = "payment_status")
        private PaymentStatus paymentStatus;

        @Column(name = "upload_date")
        private LocalDateTime uploadDate = LocalDateTime.now();

}

