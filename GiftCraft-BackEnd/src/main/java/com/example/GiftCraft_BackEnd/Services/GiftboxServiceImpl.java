package com.example.GiftCraft_BackEnd.Services;

import com.example.GiftCraft_BackEnd.DTO.GiftBoxItemDTO;
import com.example.GiftCraft_BackEnd.DTO.GiftboxCreateDTO;
import com.example.GiftCraft_BackEnd.DTO.GiftboxItemViewDTO;
import com.example.GiftCraft_BackEnd.DTO.GiftboxDetailDTO;
import com.example.GiftCraft_BackEnd.Entity.*;
import com.example.GiftCraft_BackEnd.Repo.GiftBoxItemRepo;
import com.example.GiftCraft_BackEnd.Repo.ProductRepo;
import com.example.GiftCraft_BackEnd.Services.GiftBoxPublicService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GiftboxServiceImpl implements GiftBoxPublicService {

    private final ProductRepo productRepo;
    private final GiftBoxItemRepo giftboxItemRepo;

    private static final String TYPE_SINGLE = "single";
    private static final String TYPE_GIFTBOX = "giftbox";

    @Override
    @Transactional
    public GiftboxDetailDTO create(GiftboxCreateDTO dto, Long adminUserId) {
        validateItems(dto.getItems());

        // 1) HEADER (PRODUCT) — save first
        Product header = new Product();
        header.setName(dto.getName());
        header.setDescription(dto.getDescription());
        header.setImageUrl(dto.getImageUrl());
        header.setProductType(TYPE_GIFTBOX);
        header.setCreatedBy(adminUserId);
        header.setVisible("private");     // draft on create
        header.setStock(0);
        header.setPrice(BigDecimal.ZERO); // temp until computed
        header = productRepo.save(header);   // <-- now we have giftbox_id

        // 2) COMPONENTS (GIFTBOX_PRODUCT)
        Product headerRef = productRepo.getReferenceById(header.getId());
        for (GiftBoxItemDTO it : dto.getItems()) {
            Product itemRef = productRepo.findByIdAndProductType(it.getProductId(), TYPE_SINGLE)
                    .orElseThrow(() -> new EntityNotFoundException("Single item not found: " + it.getProductId()));

            GiftBoxItem row = GiftBoxItem.builder()
                    .id(new GiftBoxItemId(header.getId(), it.getProductId()))
                    .giftbox(headerRef)
                    .item(itemRef)
                    .quantity(it.getQuantity())
                    .build();
            giftboxItemRepo.save(row);
        }

        // 3) PRICE = Σ(item.price × qty) and update header
        BigDecimal price = giftboxItemRepo.findByGiftbox_Id(header.getId()).stream()
                .map(r -> r.getItem().getPrice().multiply(BigDecimal.valueOf(r.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        header.setPrice(price);
        productRepo.save(header);

        return toDetailDTO(header.getId());
    }

    @Override
    @Transactional(readOnly = true)
    public GiftboxDetailDTO get(Long id) {
        return toDetailDTO(id);
    }

    /* ---------- helpers ---------- */

    private void validateItems(List<GiftBoxItemDTO> items) {
        if (items == null || items.isEmpty())
            throw new IllegalArgumentException("Giftbox must contain at least one item.");

        Set<Long> seen = new HashSet<>();
        for (GiftBoxItemDTO it : items) {
            if (it.getQuantity() == null || it.getQuantity() <= 0)
                throw new IllegalArgumentException("Quantity must be > 0 for productId " + it.getProductId());
            if (!seen.add(it.getProductId()))
                throw new IllegalArgumentException("Duplicate product in giftbox: " + it.getProductId());
        }
    }

    private GiftboxDetailDTO toDetailDTO(Long id) {
        Product gb = productRepo.findByIdAndProductType(id, TYPE_GIFTBOX)
                .orElseThrow(() -> new EntityNotFoundException("Giftbox not found: " + id));

        var rows = giftboxItemRepo.findByGiftbox_Id(id);

        var items = rows.stream().map(r -> {
            var unit = r.getItem().getPrice();
            var line = unit.multiply(BigDecimal.valueOf(r.getQuantity()));
            return new GiftboxItemViewDTO(
                    r.getItem().getId(),
                    r.getItem().getName(),
                    unit,
                    r.getQuantity(),
                    line
            );
        }).collect(Collectors.toList());

        return new GiftboxDetailDTO(
                gb.getId(), gb.getName(), gb.getDescription(),
                gb.getVisible(), gb.getImageUrl(), gb.getPrice(),
                gb.getCreatedAt(), items
        );
    }
}

