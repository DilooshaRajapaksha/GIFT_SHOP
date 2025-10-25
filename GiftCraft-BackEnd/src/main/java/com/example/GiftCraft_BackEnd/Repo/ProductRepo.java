package com.example.GiftCraft_BackEnd.Repo;

import com.example.GiftCraft_BackEnd.Entity.Product;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface  ProductRepo extends JpaRepository<Product, Long> {

    @Query("""
    select p from Product p
    where p.productType = 'giftbox' and p.createdBy = :userId
    order by p.createdAt desc
  """)
    Page<Product> findGiftboxesByOwner(@Param("userId") Long userId, Pageable pageable);

    Optional<Product> findByIdAndCreatedBy(Long id, Long createdBy);

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

    @Query("""
        select p from Product p
         where (:type is null or p.productType = :type)
           and (:visible is null or p.visible = :visible)
           and (:min is null or p.price >= :min)
           and (:max is null or p.price <= :max)
           and (:categoryId is null or p.categoryId = :categoryId)
        order by p.createdAt desc
    """)
    List<Product> search(
            @Param("type") String type,
            @Param("visible") String visible,
            @Param("min") BigDecimal min,
            @Param("max") BigDecimal max,
            @Param("categoryId") Long categoryId
    );

    Optional<Product> findByIdAndProductType(Long id, String type);
    List<Product> findByProductType(String type);

}
