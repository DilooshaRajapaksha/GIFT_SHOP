package com.example.GiftCraft_BackEnd.Entity;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/*
 * A "Vehicle Surprise" package, e.g. decorating a car with balloons and flowers.
 * The admin adds these with a few photos. Customers open one and order it on WhatsApp.
 */
@Entity
@Table(name = "VEHICLE_PACKAGE")
@Data
public class VehiclePackage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "package_id")
    private Long id;

    @Column(name = "name", nullable = false, length = 150)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    // what's included, one thing per line (shown as a list)
    @Column(name = "includes", columnDefinition = "TEXT")
    private String includes;

    @Column(name = "price", precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "sort_order")
    private Integer sortOrder = 0;

    @Column(name = "active")
    private Boolean active = true;

    // photo links, kept in their own small table in the order the admin added them
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "VEHICLE_PACKAGE_IMAGE", joinColumns = @JoinColumn(name = "package_id"))
    @OrderColumn(name = "position")
    @Column(name = "image_url", length = 255)
    private List<String> images = new ArrayList<>();
}
