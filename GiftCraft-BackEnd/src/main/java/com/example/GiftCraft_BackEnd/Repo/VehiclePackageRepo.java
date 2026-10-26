package com.example.GiftCraft_BackEnd.Repo;

import com.example.GiftCraft_BackEnd.Entity.VehiclePackage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VehiclePackageRepo extends JpaRepository<VehiclePackage, Long> {

    List<VehiclePackage> findByActiveTrueOrderBySortOrderAscIdAsc();

    List<VehiclePackage> findAllByOrderBySortOrderAscIdAsc();
}
