package com.example.GiftCraft_BackEnd.Services;

import com.example.GiftCraft_BackEnd.DTO.GiftboxCreateDTO;
import com.example.GiftCraft_BackEnd.DTO.GiftboxDetailDTO;

public interface GiftBoxPublicService {

    GiftboxDetailDTO create(GiftboxCreateDTO dto, Long adminUserId);
    GiftboxDetailDTO get(Long id);

}


