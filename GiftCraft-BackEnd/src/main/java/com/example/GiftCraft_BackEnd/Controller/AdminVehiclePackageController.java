package com.example.GiftCraft_BackEnd.Controller;

import com.example.GiftCraft_BackEnd.DTO.VehiclePackageRequest;
import com.example.GiftCraft_BackEnd.Entity.VehiclePackage;
import com.example.GiftCraft_BackEnd.Repo.VehiclePackageRepo;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

import static org.springframework.http.HttpStatus.NOT_FOUND;

// admin: add / edit / delete Vehicle Surprise packages and their photos
@RestController
@RequestMapping("/api/v1/admin/vehicle-packages")
public class AdminVehiclePackageController {

    private final VehiclePackageRepo repo;

    public AdminVehiclePackageController(VehiclePackageRepo repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<VehiclePackage> list() {
        return repo.findAllByOrderBySortOrderAscIdAsc();
    }

    @PostMapping
    public VehiclePackage create(@Valid @RequestBody VehiclePackageRequest req) {
        VehiclePackage p = new VehiclePackage();
        copy(req, p);
        return repo.save(p);
    }

    @PutMapping("/{id}")
    public VehiclePackage update(@PathVariable Long id, @Valid @RequestBody VehiclePackageRequest req) {
        VehiclePackage p = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Package not found"));
        copy(req, p);
        return repo.save(p);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        if (!repo.existsById(id)) {
            throw new ResponseStatusException(NOT_FOUND, "Package not found");
        }
        repo.deleteById(id);
    }

    private void copy(VehiclePackageRequest req, VehiclePackage p) {
        p.setName(req.getName().trim());
        p.setDescription(req.getDescription());
        p.setIncludes(req.getIncludes());
        p.setPrice(req.getPrice());
        p.setSortOrder(req.getSortOrder() != null ? req.getSortOrder() : 0);
        p.setActive(req.getActive() == null || req.getActive());

        // keep only real links, in the order the admin arranged them
        List<String> images = new ArrayList<>();
        if (req.getImages() != null) {
            for (String url : req.getImages()) {
                if (url != null && !url.isBlank()) images.add(url.trim());
            }
        }
        p.getImages().clear();
        p.getImages().addAll(images);
    }
}
