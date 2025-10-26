package com.example.GiftCraft_BackEnd.Repo;

import com.example.GiftCraft_BackEnd.Entity.UserRole;
import com.example.GiftCraft_BackEnd.Entity.UserRoleId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRoleRepository extends JpaRepository<UserRole, UserRoleId> {

}