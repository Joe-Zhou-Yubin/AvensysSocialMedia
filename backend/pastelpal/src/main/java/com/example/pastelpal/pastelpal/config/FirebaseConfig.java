package com.example.pastelpal.pastelpal.config;
import java.io.FileInputStream;

import javax.annotation.PostConstruct;

import org.springframework.context.annotation.Configuration;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;

@Configuration
public class FirebaseConfig {

    @PostConstruct
    public void initialization() {
        try {
            // Check if FirebaseApp is already initialized
            if (FirebaseApp.getApps().isEmpty()) {
                // Provide the path to your Firebase service account key JSON file
                String pathToServiceAccountKey = "./serviceAccountKey.json";
                FirebaseOptions options = new FirebaseOptions.Builder()
                        .setCredentials(GoogleCredentials.fromStream(new FileInputStream(pathToServiceAccountKey)))
                        .build();
                FirebaseApp.initializeApp(options);
            }
        } catch (Exception e) {
            // Handle the exception appropriately (e.g., log it or throw a custom exception)
            e.printStackTrace();
        }
    }
}


