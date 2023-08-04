package com.example.pastelpal.pastelpal.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.pastelpal.pastelpal.entity.Users;
import com.example.pastelpal.pastelpal.service.UserAuth;

@RestController
public class UserController {
	
	@Autowired
	UserAuth userAuth;
	
	@GetMapping("/users")
	public List<Users> getUsers() {
		return userAuth.getUsers();
	}
	
	@PostMapping("/createuser")
	public ResponseEntity<?> createUser(@RequestBody Users user) {
	    // Check if the username already exists
	    boolean isUsernameExists = userAuth.isUsernameExists(user.getUsername());

	    // Check if the email already exists
	    boolean isEmailExists = userAuth.isEmailExists(user.getEmail());

	    // Check if the password is valid
	    boolean isPasswordValid = userAuth.isPasswordValid(user.getPassword());

	    // Check if the username and email are required
	    boolean isUsernameRequired = user.getUsername().isEmpty();
	    boolean isEmailRequired = user.getEmail().isEmpty();

	    // Create a response map to send back to the client
	    Map<String, Object> response = new HashMap<>();
	    response.put("isUsernameExists", isUsernameExists);
	    response.put("isEmailExists", isEmailExists);
	    response.put("isPasswordValid", isPasswordValid);
	    response.put("isUsernameRequired", isUsernameRequired);
	    response.put("isEmailRequired", isEmailRequired);

	    if (isUsernameExists || isEmailExists || !isPasswordValid || isUsernameRequired || isEmailRequired) {
	        // Return a bad request response with the error details
	        return ResponseEntity.badRequest().body(response);
	    } else {
	        // Save the new user to Firestore using the UserAuth's saveUser() method
	        Users savedUser = userAuth.saveUser(user); // Pass the user object directly
	        if (savedUser != null) {
	            response.put("user", savedUser);
	            return ResponseEntity.ok(response);
	        } else {
	            // Return a server error response if user save fails
	            return ResponseEntity.status(500).body(response);
	        }
	    }
	}
	
	
	@PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> credentials) {
        // Extract the username and password from the request body
        String username = credentials.get("username");
        String password = credentials.get("password");

        // Check if the provided username and password are valid
        boolean loginSuccessful = userAuth.loginUser(username, password);

        // Create a response map to send back to the client
        Map<String, Object> response = new HashMap<>();
        response.put("loginSuccessful", loginSuccessful);

        if (loginSuccessful) {
            response.put("message", "Login successful.");
            // You can include any additional data you want to send to the client upon successful login
        } else {
            response.put("message", "Login failed. Please check your username and password.");
        }

        return ResponseEntity.ok(response);
    }
	
	@PostMapping("/logout")
	public ResponseEntity<?> logoutUser() {
	    // Perform logout logic here, find the user with isLoggedIn = true, and set it to false
	    boolean isLogoutSuccessful = userAuth.logoutUser();
	    
	    // Create a response map to send back to the client
	    Map<String, Object> response = new HashMap<>();
	    if (isLogoutSuccessful) {
	        response.put("message", "Logout successful.");
	    } else {
	        response.put("message", "Logout failed. No user found with isLoggedIn = true.");
	    }

	    return ResponseEntity.ok(response);
	}

	@GetMapping("/suggestions")
    public ResponseEntity<List<String>> getUsernameSuggestions(@RequestParam String query) {
        // Implement logic to fetch username suggestions based on the query
        // For example, you can use the UserAuth service to find matching usernames
        List<String> suggestions = userAuth.findUsernameSuggestions(query);
        return ResponseEntity.ok(suggestions);
    }
	
	
	@PostMapping("/updateuser")
    public ResponseEntity<Users> updateUser(@RequestBody Users user) {
//        String userId = user.getId();
//        String username = user.getUsername();
//        String email = user.getEmail();
//        boolean admin = user.isAdmin();

        Users updatedUser = userAuth.updateUser(user);
        if (updatedUser != null) {
            return new ResponseEntity<>(updatedUser, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

	@DeleteMapping("/deleteuser/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable String userId) {
        boolean deleted = userAuth.deleteUser(userId);
        if (deleted) {
            return new ResponseEntity<>(HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
	
	 @GetMapping("/loggedinadmin")
	    public boolean isLoggedInAdmin() {
	        return userAuth.isAdminUserLoggedIn();
	    }
	 
	 @GetMapping("/loggedinuser")
	    public boolean isLoggedInUser() {
	        return userAuth.isUserUserLoggedIn();
	    }

}
