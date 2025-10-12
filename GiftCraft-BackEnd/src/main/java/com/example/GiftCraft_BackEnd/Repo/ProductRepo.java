package com.example.GiftCraft_BackEnd.Repo;

import com.example.GiftCraft_BackEnd.Entity.Product;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface  ProductRepo extends JpaRepository<Product, Integer> {

    @Query("""
    select p from Product p
    where p.productType = 'giftbox' and p.createdBy = :userId
    order by p.createdAt desc
  """)
    Page<Product> findGiftboxesByOwner(@Param("userId") Integer userId, Pageable pageable);

    Optional<Product> findByIdAndCreatedBy(Integer id, Integer createdBy);

    @Query("""
     select p from Product p 
     where p.productType='single' and p.visible='public'
      and (:q is null or lower(p.name) like lower(concat('%', :q, '%')))
      and (:cat is null or p.categoryId = :cat)
     order by p.createdAt desc 
""")

    Page<Product> searchSingles(@Param("q") String query,
                                @Param("cat") Integer categoryId,
                                Pageable pageable);
}
