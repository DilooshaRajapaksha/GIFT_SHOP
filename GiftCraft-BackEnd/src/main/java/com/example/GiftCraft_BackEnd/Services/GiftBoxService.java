package com.example.GiftCraft_BackEnd.Services;

import com.example.GiftCraft_BackEnd.DTO.*;
import com.example.GiftCraft_BackEnd.Entity.GiftBoxItem;
import com.example.GiftCraft_BackEnd.Entity.Product;
import com.example.GiftCraft_BackEnd.Repo.GiftBoxItemRepo;
import com.example.GiftCraft_BackEnd.Repo.ProductRepo;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import static org.springframework.http.HttpStatus.*;

@Service
@RequiredArgsConstructor
public class GiftBoxService {

    private final ProductRepo productRepo;
    private final GiftBoxItemRepo itemRepo;
    private final ModelMapper modelMapper;

    private Integer currentUserId() { return 1; }   // replace with auth later

    @Transactional
    public GiftBoxResponse create(GiftBoxCreateRequest req) {
        Integer userId = currentUserId();

        Product box = new Product();
        box.setName(req.getName());
        box.setProductType("giftbox");
        box.setVisible("private");
        box.setCreatedBy(userId);
        box.setStock(0);
        box.setPrice(BigDecimal.ZERO);
        productRepo.save(box);

        for (GiftBoxItemDTO r : req.getItems()) {
            Product item = productRepo.findById(r.getProductId())
                    .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Product not found: " + r.getProductId()));
            if (!"single".equalsIgnoreCase(item.getProductType()))
                throw new ResponseStatusException(CONFLICT, "Only single products can be added");
            if (r.getQuantity() == null || r.getQuantity() <= 0)
                throw new ResponseStatusException(BAD_REQUEST, "Quantity must be >= 1");
            if (r.getQuantity() > item.getStock())
                throw new ResponseStatusException(CONFLICT, "Only " + item.getStock() + " left for product " + item.getId());

            itemRepo.upsertLine(box.getId(), r.getProductId(), r.getQuantity());
        }

        BigDecimal total = itemRepo.sumTotal(box.getId());
        box.setPrice(total);
        productRepo.save(box);

        return toResponse(box, itemRepo.findByGiftbox_Id(box.getId()), total);
    }

    public List<GiftBoxResponse> list(int page, int size) {
        Integer userId = currentUserId();
        Page<Product> pg = productRepo.findGiftboxesByOwner(userId, PageRequest.of(page, size));
        List<GiftBoxResponse> out = new ArrayList<>();
        for (Product p : pg.getContent()) {
            out.add(new GiftBoxResponse(p.getId(), p.getName(), p.getPrice(), List.of()));
        }
        return out;
    }

    public GiftBoxResponse get(Integer id) {
        Product box = requireOwner(id);
        var lines = itemRepo.findByGiftbox_Id(id);
        BigDecimal total = itemRepo.sumTotal(id);
        return toResponse(box, lines, total);
    }

    @Transactional
    public GiftBoxResponse update(Integer id, GiftBoxUpdateRequest req) {
        Product box = requireOwner(id);

        if (req.getName() != null && !req.getName().isBlank()) box.setName(req.getName());
        if (req.getItems() == null) {
            throw new ResponseStatusException(UNPROCESSABLE_ENTITY, "Items cannot be null");
        }

        for (GiftBoxItemDTO r : req.getItems()) {
            Product item = productRepo.findById(r.getProductId())
                    .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Product not found: " + r.getProductId()));
            if (!"single".equalsIgnoreCase(item.getProductType()))
                throw new ResponseStatusException(CONFLICT, "Only single products can be added");
            if (r.getQuantity() == null || r.getQuantity() < 0)
                throw new ResponseStatusException(BAD_REQUEST, "Quantity must be >= 0");
            if (r.getQuantity() > item.getStock())
                throw new ResponseStatusException(CONFLICT, "Only " + item.getStock() + " left for product " + item.getId());

            if (r.getQuantity() == 0) itemRepo.deleteLine(id, r.getProductId());
            else itemRepo.upsertLine(id, r.getProductId(), r.getQuantity());
        }

        BigDecimal total = itemRepo.sumTotal(id);
        box.setPrice(total);
        productRepo.save(box);

        return toResponse(box, itemRepo.findByGiftbox_Id(id), total);
    }

    @Transactional
    public boolean delete(Integer id) {
        Product box = requireOwner(id);
        productRepo.delete(box);
        return true;
    }

    // ---- helpers ----
    private Product requireOwner(Integer boxId) {
        Integer userId = currentUserId();
        Product box = productRepo.findById(boxId).orElseThrow(EntityNotFoundException::new);
        if (box.getCreatedBy() == null || !box.getCreatedBy().equals(userId)) {
            throw new ResponseStatusException(FORBIDDEN, "Not allowed to modify this gift box");
        }
        if (!"giftbox".equalsIgnoreCase(box.getProductType())) {
            throw new ResponseStatusException(CONFLICT, "Target is not a giftbox");
        }
        return box;
    }

    private GiftBoxResponse toResponse(Product box, List<com.example.GiftCraft_BackEnd.Entity.GiftBoxItem> lines, BigDecimal total) {
        List<GiftBoxResponse.GiftBoxItemInfo> itemInfos = new ArrayList<>();
        for (var l : lines) {
            var unit = l.getItem().getPrice();
            var lineTotal = unit.multiply(java.math.BigDecimal.valueOf(l.getQuantity()));
            itemInfos.add(new GiftBoxResponse.GiftBoxItemInfo(
                    l.getItem().getId(),
                    l.getItem().getName(),
                    l.getQuantity(),
                    unit,
                    lineTotal
            ));
        }
        return new GiftBoxResponse(box.getId(), box.getName(), total, itemInfos);
    }

    public GiftBoxResponse quote(GiftBoxCreateRequest draft) {
        var itemsOut = new java.util.ArrayList<GiftBoxResponse.GiftBoxItemInfo>();
        java.math.BigDecimal total = java.math.BigDecimal.ZERO;

        for (var r : draft.getItems()) {
            var item = productRepo.findById(r.getProductId())
                    .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Product not found: " + r.getProductId()));
            if (!"single".equalsIgnoreCase(item.getProductType()))
                throw new ResponseStatusException(CONFLICT, "Only single products can be added");
            int qty = (r.getQuantity() == null ? 0 : r.getQuantity());
            if (qty < 0) throw new ResponseStatusException(BAD_REQUEST, "Quantity must be >= 0");
            if (qty > item.getStock())
                throw new ResponseStatusException(CONFLICT, "Only " + item.getStock() + " left for " + item.getName());

            var line = item.getPrice().multiply(java.math.BigDecimal.valueOf(qty));
            total = total.add(line);
            itemsOut.add(new GiftBoxResponse.GiftBoxItemInfo(
                    item.getId(), item.getName(), qty, item.getPrice(), line
            ));
        }
        return new GiftBoxResponse(null, draft.getName(), total, itemsOut);
    }



}
