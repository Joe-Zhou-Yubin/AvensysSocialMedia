package com.example.pastelpal.pastelpal.service;

import com.example.pastelpal.pastelpal.entity.Posts;
import com.google.api.core.ApiFuture;
import com.google.api.core.ApiFutures;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;

import com.google.common.util.concurrent.Futures;
import com.google.common.util.concurrent.ListenableFuture;

import java.util.List;
import java.util.ArrayList;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Executors;

import com.example.pastelpal.pastelpal.entity.Users;
import com.google.cloud.firestore.Query;
import com.google.cloud.firestore.QuerySnapshot;

@Service
public class PostAuth {
    
    private final Firestore firestore = FirestoreClient.getFirestore();
    
 // Method to create a new post in the "posts" collection.
    public void createNewPost(String title, String caption, String mediaType, String mediaUrl) {
        CollectionReference collectionReference = firestore.collection("users");
        Query query = collectionReference.whereEqualTo("loggedIn", true).limit(1);

        try {
            ApiFuture<QuerySnapshot> future = query.get();
            QuerySnapshot snapshot = future.get();
            if (!snapshot.isEmpty()) {
                DocumentSnapshot document = snapshot.getDocuments().get(0);
                Users user = document.toObject(Users.class);
                if (user != null) {
                    // Get the username of the logged-in user.
                    String username = user.getUsername();

                    // Create a new Posts object with the provided data and the username of the logged-in user.
                    Posts newPost = new Posts(title, caption, username, mediaType, mediaUrl);

                    // Add the new post data to the "posts" collection in Firestore.
                    CollectionReference postsCollection = firestore.collection("posts");
                    ApiFuture<DocumentReference> documentReferenceApiFuture = postsCollection.add(newPost);

                    // Get the reference to the newly created post document and print its ID.
                    DocumentReference newPostDocumentRef = documentReferenceApiFuture.get();
                    System.out.println("New post created with ID: " + newPostDocumentRef.getId());
                }
            } else {
                // Handle the case when the user is not logged in or does not exist.
                System.err.println("User is not logged in or does not exist.");
            }
        } catch (InterruptedException | ExecutionException e) {
            // Handle exceptions if any.
            e.printStackTrace();
        }
    }
    
 // Method to fetch all posts from the "posts" collection and return them as a list of Posts objects.
    public List<Posts> getPosts() {
        CollectionReference postsCollection = firestore.collection("posts");
        try {
            ApiFuture<QuerySnapshot> future = postsCollection.get();
            List<Posts> postsList = new ArrayList<>();

            for (DocumentSnapshot document : future.get().getDocuments()) {
                Posts post = document.toObject(Posts.class);
                if (post != null) {
                    // Set the post ID to the Firestore document ID
                    post.setPostId(document.getId());
                    postsList.add(post);
                }
            }

            return postsList;
        } catch (InterruptedException | ExecutionException e) {
            // Handle exceptions if any.
            e.printStackTrace();
            return null;
        }
    }
    
 
 // Method to fetch posts with media hosted online from the "posts" collection.
    public List<Posts> getOnlinePosts() {
        CollectionReference postsCollection = firestore.collection("posts");
        try {
            ApiFuture<QuerySnapshot> queryFuture = postsCollection.whereEqualTo("mediaType", "online").get();
            List<Posts> onlinePostsList = new ArrayList<>();

            for (DocumentSnapshot document : queryFuture.get().getDocuments()) {
                Posts post = document.toObject(Posts.class);
                if (post != null) {
                    // Set the post ID to the Firestore document ID
                    post.setPostId(document.getId());
                    onlinePostsList.add(post);
                }
            }

            return onlinePostsList;
        } catch (InterruptedException | ExecutionException e) {
            // Handle exceptions if any.
            e.printStackTrace();
            return null;
        }
    }
    
    
    
 // Method to fetch posts filtered by the selected username and return them as a list of Posts objects.
    public List<Posts> getPostsByUserName(String username) {
        CollectionReference postsCollection = firestore.collection("posts");
        try {
            Query query = postsCollection.whereEqualTo("username", username);
            ApiFuture<QuerySnapshot> future = query.get();
            List<Posts> postsList = new ArrayList<>();

            for (DocumentSnapshot document : future.get().getDocuments()) {
                Posts post = document.toObject(Posts.class);
                if (post != null) {
                    // Set the post ID to the Firestore document ID
                    post.setPostId(document.getId());
                    postsList.add(post);
                }
            }

            return postsList;
        } catch (InterruptedException | ExecutionException e) {
            // Handle exceptions if any.
            e.printStackTrace();
            return null;
        }
    }
    
 // Method to fetch online posts filtered by the selected username and return them as a list of Posts objects.
    public List<Posts> getOnlinePostsByUsername(String username) {
        CollectionReference postsCollection = firestore.collection("posts");
        try {
            // Query to fetch posts with the specified username and mediaType set to "online"
            Query query = postsCollection.whereEqualTo("username", username)
                                         .whereEqualTo("mediaType", "online");
            ApiFuture<QuerySnapshot> future = query.get();
            List<Posts> postsList = new ArrayList<>();

            for (DocumentSnapshot document : future.get().getDocuments()) {
                Posts post = document.toObject(Posts.class);
                if (post != null) {
                    // Set the post ID to the Firestore document ID
                    post.setPostId(document.getId());
                    postsList.add(post);
                }
            }

            return postsList;
        } catch (InterruptedException | ExecutionException e) {
            // Handle exceptions if any.
            e.printStackTrace();
            return null;
        }
    }

    //get posts of user logged in
    public List<Posts> getPostsOnline() {
        CollectionReference usersCollection = firestore.collection("users");
        try {
            Query query = usersCollection.whereEqualTo("loggedIn", true);
            ApiFuture<QuerySnapshot> future = query.get();
            List<Posts> postsList = new ArrayList<>();

            for (DocumentSnapshot document : future.get().getDocuments()) {
                Users user = document.toObject(Users.class);
                if (user != null) {
                    String username = user.getUsername();
                    List<Posts> userPosts = getPostsByUserName(username);
                    postsList.addAll(userPosts);
                }
            }

            return postsList;
        } catch (InterruptedException | ExecutionException e) {
            // Handle exceptions if any.
            e.printStackTrace();
            return null;
        }
    }
    //get online posts of online user
    public List<Posts> getOnlinePostsOnline() {
        CollectionReference usersCollection = firestore.collection("users");
        CollectionReference postsCollection = firestore.collection("posts");
        List<Posts> postsList = new ArrayList<>();

        try {
            // First, query for the users who are logged in
            Query loggedInUsersQuery = usersCollection.whereEqualTo("loggedIn", true);
            ApiFuture<QuerySnapshot> loggedInUsersFuture = loggedInUsersQuery.get();

            // Loop through the logged-in users
            for (DocumentSnapshot userDocument : loggedInUsersFuture.get().getDocuments()) {
                Users user = userDocument.toObject(Users.class);
                if (user != null) {
                    String username = user.getUsername();

                    // Next, query the posts collection for online posts of the current user
                    Query onlinePostsQuery = postsCollection
                            .whereEqualTo("username", username)
                            .whereEqualTo("mediaType", "online");
                    ApiFuture<QuerySnapshot> onlinePostsFuture = onlinePostsQuery.get();

                    // Loop through the online posts and add them to the postsList
                    for (DocumentSnapshot postDocument : onlinePostsFuture.get().getDocuments()) {
                        Posts post = postDocument.toObject(Posts.class);
                        if (post != null) {
                            postsList.add(post);
                        }
                    }
                }
            }

            return postsList;
        } catch (InterruptedException | ExecutionException e) {
            // Handle exceptions if any.
            e.printStackTrace();
            return null;
        }
    }
    
    
 // Method to delete a post from the "posts" collection based on the postId.
    public void deletePost(String postId) {
        try {
            // Use the postId as the document ID
            DocumentReference postDocRef = firestore.collection("posts").document(postId);
            postDocRef.delete();
            System.out.println("Post with ID " + postId + " has been deleted successfully.");
        } catch (Exception e) {
            // Handle exceptions if any.
            e.printStackTrace();
        }
    }
    
 // Method to update a post in the "posts" collection based on the document ID.
    public Posts updatePost(String documentId, String title, String caption) {
        try {
            // Find the post document in Firestore using the document ID
            DocumentReference postDocRef = firestore.collection("posts").document(documentId);
            ApiFuture<DocumentSnapshot> future = postDocRef.get();

            DocumentSnapshot document = future.get();
            if (document.exists()) {
                // If the document exists, update the fields directly using the document reference
                postDocRef.update("title", title);
                postDocRef.update("caption", caption);

                // Fetch the updated post to get the new data
                ApiFuture<DocumentSnapshot> updatedFuture = postDocRef.get();
                DocumentSnapshot updatedDocument = updatedFuture.get();
                if (updatedDocument.exists()) {
                    // Convert the updated document data to a Posts object
                    Posts updatedPost = updatedDocument.toObject(Posts.class);
                    if (updatedPost != null) {
                        return updatedPost;
                    }
                }
            } else {
                // Handle the case when the post with the given documentId does not exist.
                System.err.println("Post with ID " + documentId + " does not exist.");
            }
        } catch (InterruptedException | ExecutionException e) {
            // Handle exceptions if any.
            e.printStackTrace();
        }
        return null;
    }



    
 // Method to fetch a post from the "posts" collection based on the postId and return it as a Posts object.
    public Posts getPostByPostId(String postId) {
        try {
            // Use the postId to get the document reference of the post
            DocumentReference postDocRef = firestore.collection("posts").document(postId);

            // Fetch the post data
            ApiFuture<DocumentSnapshot> future = postDocRef.get();
            DocumentSnapshot document = future.get();

            if (document.exists()) {
                // Convert the document data to a Posts object
                Posts post = document.toObject(Posts.class);
                if (post != null) {
                    // Set the post ID to the Firestore document ID
                    post.setPostId(document.getId());
                    return post;
                }
            } else {
                // Handle the case when the post does not exist.
                System.err.println("Post with ID " + postId + " does not exist.");
            }
        } catch (InterruptedException | ExecutionException e) {
            // Handle exceptions if any.
            e.printStackTrace();
        }
        return null;
    }

    
    
    
    
    
}
