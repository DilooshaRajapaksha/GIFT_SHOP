package com.example.GiftCraft_BackEnd.Entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "USER_ROLE")
@Data  
@IdClass(UserRoleId.class)  
@NoArgsConstructor
@AllArgsConstructor
public class UserRole {

    @Id
    @Column(name = "user_id")
    private Long userId;  

    @Id
    @Column(name = "role_id")
    private Long roleId;  

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("roleId")
    @JoinColumn(name = "role_id")
    private Role role;  

    
    public UserRole(User user, Role role) {
        this.user = user;
        this.role = role;
        if (user != null) this.userId = user.getUserId();
        if (role != null) this.roleId = role.getId();
    }
}