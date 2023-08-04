package com.example.pastelpal.pastelpal.entity;
import java.util.List;
import java.util.ArrayList;
import java.util.UUID;

import com.google.cloud.firestore.annotation.DocumentId;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

@Entity
public class Users {

	@Id
    private String id;

    private String userId;
    private String username;
    private String email;
    private String password; 
    private boolean isAdmin;

    private boolean isLoggedIn;


    public Users() {
        // By default, user is not an Admin
        this.isAdmin = false;
        this.isLoggedIn = false;
        this.userId = generateUserId();
    }

    public Users(String id, String username, String email, String password, boolean isAdmin, boolean isLoggedIn) {
        this.id = id;
        this.userId = generateUserId(); // Generate a unique 8-number UUID
        this.username = username;
        this.email = email;
        this.password = password;
        this.isAdmin = isAdmin;
        this.isLoggedIn = isLoggedIn;
    }

    private String generateUserId() {
        UUID uuid = UUID.randomUUID();
        String randomUUIDString = uuid.toString().replaceAll("-", "").substring(0, 8);
        return randomUUIDString;
    }
    
    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public boolean isLoggedIn() {
        return isLoggedIn;
    }

    public void setLoggedIn(boolean isLoggedIn) {
        this.isLoggedIn = isLoggedIn;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
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

    public boolean isAdmin() {
        return isAdmin;
    }

    public void setAdmin(boolean admin) {
        isAdmin = admin;
    }

	@Override
	public String toString() {
		return "Users [id=" + id + ", userId=" + userId + ", username=" + username + ", email=" + email + ", password="
				+ password + ", isAdmin=" + isAdmin + ", isLoggedIn=" + isLoggedIn + "]";
	}


}
