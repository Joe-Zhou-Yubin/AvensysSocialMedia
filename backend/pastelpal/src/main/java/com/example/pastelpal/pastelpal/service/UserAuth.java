package com.example.pastelpal.pastelpal.service;

import java.util.List;
import java.util.ArrayList;
import java.util.Collections;

import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import com.example.pastelpal.pastelpal.entity.Users;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.Query;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.cloud.firestore.WriteBatch;
import com.google.cloud.firestore.WriteResult;
import com.google.firebase.cloud.FirestoreClient;



@Service
public class UserAuth {

    private final Firestore firestore = FirestoreClient.getFirestore();

    private static final String COLLECTION_NAME = "users";
    
    
  // Get all users
    public List<Users> getUsers() {
        CollectionReference collectionReference = firestore.collection(COLLECTION_NAME);
        try {
            ApiFuture<QuerySnapshot> future = collectionReference.get();
            List<Users> usersList = new ArrayList<>();

            for (DocumentSnapshot document : future.get().getDocuments()) {
                Users user = document.toObject(Users.class);
                if (user != null) {
                    user.setId(document.getId()); // Map Firestore document ID to id field
                    usersList.add(user);
                }
            }

            return usersList;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
    
 // Save user from frontend and return the saved user data
    public Users saveUser(Users user) {
        // Save the new user to Firestore using the createUser() method in this class
        return createUser(user);
    }


    // Create new user in Firestore
    public Users createUser(Users user) {
        CollectionReference collectionReference = firestore.collection(COLLECTION_NAME);
        DocumentReference docRef = collectionReference.document();
        user.setId(docRef.getId());

        // Only create the user, but do not save it in Firestore here
        // The saving process should be handled in the saveUser() method

        return user; // Return the user object after successful creation
    }


    
  //check if username exists
    public boolean isUsernameExists(String username) {
        CollectionReference collectionReference = firestore.collection(COLLECTION_NAME);
        Query query = collectionReference.whereEqualTo("username", username).limit(1);

        try {
            ApiFuture<QuerySnapshot> future = query.get();
            QuerySnapshot snapshot = future.get();
            return !snapshot.isEmpty();
        } catch (Exception e) {
            e.printStackTrace();
            return true; // Consider returning true here to be cautious when an error occurs
        }
    }

    //check if email exists
    public boolean isEmailExists(String email) {
        CollectionReference collectionReference = firestore.collection(COLLECTION_NAME);
        Query query = collectionReference.whereEqualTo("email", email).limit(1);

        try {
            ApiFuture<QuerySnapshot> future = query.get();
            QuerySnapshot snapshot = future.get();
            return !snapshot.isEmpty();
        } catch (Exception e) {
            e.printStackTrace();
            return true; // Consider returning true here to be cautious when an error occurs
        }
    }
    //password length
    public boolean isPasswordValid(String password) {
        return password.length() >= 8;
    }
    
    public boolean loginUser(String username, String password) {
        // Perform login logic here, check if the provided username and password are valid
        Users user = findUserByUsername(username);
        if (user != null && user.getPassword().equals(password)) {
            // Set isLoggedIn to true for the user
            user.setLoggedIn(true);

            // Save the updated user in Firestore
            firestore.collection(COLLECTION_NAME).document(user.getId()).set(user);

            return true;
        }
        return false; // Login failed
    }
    
    public boolean logoutUser() {
        // Perform logout logic here, find the user with isLoggedIn = true, and set it to false
        CollectionReference collectionReference = firestore.collection(COLLECTION_NAME);
        Query query = collectionReference.whereEqualTo("loggedIn", true).limit(1);

        try {
            ApiFuture<QuerySnapshot> future = query.get();
            QuerySnapshot snapshot = future.get();
            if (!snapshot.isEmpty()) {
                DocumentSnapshot document = snapshot.getDocuments().get(0);
                Users user = document.toObject(Users.class);
                if (user != null) {
                    user.setLoggedIn(false);

                    // Save the updated user in Firestore
                    firestore.collection(COLLECTION_NAME).document(user.getId()).set(user);

                    return true;
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false; // Logout failed, no user found with isLoggedIn = true
    }


    private Users findUserByUsername(String username) {
        // Implement a method to find a user by their username from Firestore
        // and return the Users object if found, or null otherwise.
        // You can use the Firestore API or any other method to query for the user.
        CollectionReference collectionReference = firestore.collection(COLLECTION_NAME);
        Query query = collectionReference.whereEqualTo("username", username).limit(1);

        try {
            ApiFuture<QuerySnapshot> future = query.get();
            QuerySnapshot snapshot = future.get();
            if (!snapshot.isEmpty()) {
                DocumentSnapshot document = snapshot.getDocuments().get(0);
                Users user = document.toObject(Users.class);
                if (user != null) {
                    user.setId(document.getId()); // Map Firestore document ID to id field
                    return user;
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public List<String> findUsernameSuggestions(String query) {
        CollectionReference collectionReference = firestore.collection(COLLECTION_NAME);
        Query usernameQuery = collectionReference.whereGreaterThanOrEqualTo("username", query)
                                                .whereLessThan("username", query + "z")
                                                .limit(10); // Limit the number of suggestions to 10

        try {
            ApiFuture<QuerySnapshot> future = usernameQuery.get();
            QuerySnapshot snapshot = future.get();
            List<String> suggestions = new ArrayList<>();

            for (DocumentSnapshot document : snapshot.getDocuments()) {
                Users user = document.toObject(Users.class);
                if (user != null) {
                    suggestions.add(user.getUsername());
                }
            }

            return suggestions;
        } catch (Exception e) {
            e.printStackTrace();
            return Collections.emptyList();
        }
    }
    
 // Update user
    public Users updateUser(@RequestBody Users user) {
        // Find the user document in Firestore
        DocumentReference documentReference = firestore.collection(COLLECTION_NAME).document(user.getId());
        ApiFuture<DocumentSnapshot> future = documentReference.get();

        try {
            DocumentSnapshot document = future.get();
            if (document.exists()) {
                // If the document exists, update the fields
                Users existingUser = document.toObject(Users.class);
                if (existingUser != null) {
                    existingUser.setUsername(user.getUsername());
                    existingUser.setEmail(user.getEmail());
                    existingUser.setAdmin(user.isAdmin());

                    // Save the updated user back to Firestore
                    documentReference.set(existingUser).get();
                    return existingUser;
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    
    //delete user
    public boolean deleteUser(String userId) {
        // Find the user document in Firestore and delete it
        try {
            firestore.collection(COLLECTION_NAME).document(userId).delete().get();
            return true;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }
    
 // Check if a user with field "loggedIn" is also an admin
    public boolean isAdminUserLoggedIn() {
        CollectionReference collectionReference = firestore.collection(COLLECTION_NAME);
        Query query = collectionReference.whereEqualTo("loggedIn", true)
                                         .whereEqualTo("admin", true)
                                         .limit(1);

        try {
            ApiFuture<QuerySnapshot> future = query.get();
            QuerySnapshot snapshot = future.get();
            return !snapshot.isEmpty();
        } catch (Exception e) {
            e.printStackTrace();
            return false; // Consider returning false here to be cautious when an error occurs
        }
    }
    
    // Check if a user with field "loggedIn" is true
    public boolean isUserUserLoggedIn() {
        CollectionReference collectionReference = firestore.collection(COLLECTION_NAME);
        Query query = collectionReference.whereEqualTo("loggedIn", true)
                                         .limit(1);

        try {
            ApiFuture<QuerySnapshot> future = query.get();
            QuerySnapshot snapshot = future.get();
            return !snapshot.isEmpty();
        } catch (Exception e) {
            e.printStackTrace();
            return false; // Consider returning false here to be cautious when an error occurs
        }
    }


    
    
}