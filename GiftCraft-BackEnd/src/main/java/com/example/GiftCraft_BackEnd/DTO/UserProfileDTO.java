package com.example.GiftCraft_BackEnd.DTO;

import com.example.GiftCraft_BackEnd.Entity.User;

public class UserProfileDTO {
    private String email;
    private String firstName;
    private String lastName;
    private String address;
    private String phoneNumber;

    public UserProfileDTO(User user) {
        this.email = user.getEmail();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.address = user.getAddress();
        this.phoneNumber = user.getPhoneNumber();
    }


    public String getEmail() { 
        return email; 
    }
    public String getFirstName() { 
        return firstName; 
    }
    public String getLastName() { 
        return lastName; 
    }
    public String getAddress() { 
        return address; 
    }
    public String getPhoneNumber() { 
        return phoneNumber; 
    }
}