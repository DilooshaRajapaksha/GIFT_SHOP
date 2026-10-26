package com.example.GiftCraft_BackEnd.Entity;

import jakarta.persistence.*;
import lombok.Data;

/*
 * Everything on the home page that the admin can change:
 *   type = HERO      -> big slides at the top
 *   type = CATEGORY  -> the scrolling category circles
 *   type = BANNER    -> the wide banner slides in the middle
 * One table for all three keeps it simple. sortOrder decides the order they show in.
 */
@Entity
@Table(name = "HOME_ITEM")
@Data
public class HomeItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "home_item_id")
    private Long id;

    @Column(name = "type", nullable = false, length = 20)
    private String type;          // HERO, CATEGORY or BANNER

    @Column(name = "title", length = 150)
    private String title;

    @Column(name = "subtitle", length = 300)
    private String subtitle;

    @Column(name = "button_text", length = 60)
    private String buttonText;

    @Column(name = "link_url", length = 255)
    private String linkUrl;       // where the button / category goes, e.g. /giftbox

    @Column(name = "image_url", length = 255)
    private String imageUrl;

    @Column(name = "sort_order")
    private Integer sortOrder = 0;

    @Column(name = "active")
    private Boolean active = true;
}
