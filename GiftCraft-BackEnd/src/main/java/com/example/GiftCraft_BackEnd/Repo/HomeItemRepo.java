package com.example.GiftCraft_BackEnd.Repo;

import com.example.GiftCraft_BackEnd.Entity.HomeItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HomeItemRepo extends JpaRepository<HomeItem, Long> {

    // for the public home page (only active ones)
    List<HomeItem> findByActiveTrueOrderByTypeAscSortOrderAscIdAsc();

    // for the admin panel (everything)
    List<HomeItem> findAllByOrderByTypeAscSortOrderAscIdAsc();
}
