package com.example.GiftCraft_BackEnd.DTO;

public class ProfileUpdateRequest {
    private String fname;
    private String lname;
    private String address;
    private String phoneNumber;
    private String newPassword;
    private String currentPassword;
    private String confirmNewPassword;

    public String getFname() { 
        return fname; 
    }
    public void setFname(String fname) { 
        this.fname = fname; 
    }

    public String getLname() { 
        return lname; 
    }
    public void setLname(String lname) { 
        this.lname = lname; }

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

    public String getNewPassword() { 
        return newPassword; 
    }
    public void setNewPassword(String newPassword) { 
        this.newPassword = newPassword; 
    }

    public String getCurrentPassword() { 
        return currentPassword; 
    }
    public void setCurrentPassword(String currentPassword) { 
        this.currentPassword = currentPassword; 
    }
    public String getConfirmNewPassword() {
    return confirmNewPassword;
    }

    public void setConfirmNewPassword(String confirmNewPassword) {
    this.confirmNewPassword = confirmNewPassword;
    }
    
}