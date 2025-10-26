package com.example.GiftCraft_BackEnd.DTO;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class StatusDTO {
    @NotBlank
        private String status;
}

