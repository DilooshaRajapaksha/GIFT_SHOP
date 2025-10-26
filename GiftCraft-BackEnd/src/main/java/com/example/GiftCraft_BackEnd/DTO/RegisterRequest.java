package com.example.GiftCraft_BackEnd.DTO;

import java.util.HashSet;
import java.util.Set;

public class RegisterRequest {
    private String fname;
    private String lname;
    private String email;
    private String password;
    private String confirmedPassword;
    private String address;
    private String phoneNumber;
    private Set<String> roles = new HashSet<>();


    public String getFname(){
        return fname;
    }

    public void setFname(String fname){
        this.fname = fname;
    }

    public String getLname(){
        return lname;
    }

    public void setLname(String lname){
        this.lname = lname;
    }

    public String getEmail() { 
        return email; 
    }
    public void setEmail(String email) { 
        this.email = email; 
    }

    public String getPassword() { 
        return password; 
    }
    public void setPassword(String password) { 
        this.password = password; 
    }

    public String getConfirmedPassword() { 
        return confirmedPassword; 
    }
    public void setConfirmedPassword(String confirmedPassword) { 
        this.confirmedPassword = confirmedPassword; 
    }

    public String getAddress() { 
        return address; 
    }
    public void setAddress(String address) { 
        this.address = address; 
    }

    public String getPhoneNumber() { 
        return phoneNumber; 
    }
    public void setPhoneNumber(String phoneNumber) { 
        this.phoneNumber = phoneNumber; 
    }

    public Set<String> getRoles(){
        return roles;
    }

    public void setRoles(Set<String> roles){
        this.roles = roles;
    }
}


