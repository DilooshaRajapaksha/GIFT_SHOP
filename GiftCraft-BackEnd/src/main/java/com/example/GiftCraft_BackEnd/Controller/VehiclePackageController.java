package com.example.GiftCraft_BackEnd.Controller;

import com.example.GiftCraft_BackEnd.Entity.VehiclePackage;
import com.example.GiftCraft_BackEnd.Repo.VehiclePackageRepo;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

// public: the "Vehicle Surprise" page lists the packages that are switched on
@RestController
@RequestMapping("/api/v1/vehicle-packages")
public class VehiclePackageController {

    private final VehiclePackageRepo repo;

    public VehiclePackageController(VehiclePackageRepo repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<VehiclePackage> list() {
        return repo.findByActiveTrueOrderBySortOrderAscIdAsc();
    }
}
