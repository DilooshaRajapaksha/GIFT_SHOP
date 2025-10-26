package com.example.GiftCraft_BackEnd.Entity;


import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@EqualsAndHashCode
public class UserRoleId implements Serializable {
    private Long userId;
    private Long roleId;

    public UserRoleId(){}

    public UserRoleId(Long userId, Long roleId) {
        this.userId = userId;
        this.roleId = roleId;
    }
}
