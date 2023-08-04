package com.example.pastelpal.pastelpal.controller;

import com.example.pastelpal.pastelpal.entity.Posts;
import com.example.pastelpal.pastelpal.service.PostAuth;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class PostController {
	
	@Autowired
    PostAuth postAuth;

    @Autowired
    public PostController(PostAuth postAuth) {
        this.postAuth = postAuth;
    }

    // Define the /createpost endpoint to create a new post.
    @PostMapping("/createpost")
    public ResponseEntity<String> createPost(@RequestBody Posts newPost) {
        String title = newPost.getTitle();
        String caption = newPost.getCaption();
        String mediaType = newPost.getMediaType();
        String mediaUrl = newPost.getMediaUrl();

        // Call the createNewPost method to create the new post.
        postAuth.createNewPost(title, caption, mediaType, mediaUrl);

        // Return a success response.
        return ResponseEntity.status(HttpStatus.CREATED).body("Post created successfully.");
    }
    
    @GetMapping("/getpost")
    public List<Posts> getAllPosts() {
        return postAuth.getPosts();
    }
    
 // Get posts by username
    @GetMapping("/getpost/{username}")
    public ResponseEntity<List<Posts>> getPostsByUserName(@PathVariable String username) {
        List<Posts> posts = postAuth.getPostsByUserName(username);
        return ResponseEntity.ok(posts);
    }
    //get posts mediatype online by username
    @GetMapping("/getonlinepost/{username}")
    public ResponseEntity<List<Posts>> getOnlinePostsByUsername(@PathVariable String username) {
        List<Posts> onlinePosts = postAuth.getOnlinePostsByUsername(username);
        if (onlinePosts != null && !onlinePosts.isEmpty()) {
            return ResponseEntity.ok(onlinePosts);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/getonlinepost")
    public List<Posts> getOnlinePosts() {
        return postAuth.getPostsOnline();
    }
    
    @GetMapping("/getonlineonlinepost")
    public List<Posts> getOnlineOnlinePosts() {
        return postAuth.getOnlinePostsOnline();
    }
    
    
    @DeleteMapping("/deletepost/{postId}")
    public ResponseEntity<String> deletePost(@PathVariable("postId") String postId) {
        postAuth.deletePost(postId);
        return ResponseEntity.ok("Post with ID " + postId + " has been deleted successfully.");
    }
    
    @DeleteMapping("/admindeletepost/{postId}")
    public ResponseEntity<String> admindeletePost(@PathVariable("postId") String postId) {
        postAuth.deletePost(postId);
        return ResponseEntity.ok("Post with ID " + postId + " has been deleted successfully.");
    }
    
    @PostMapping("/updatepost/{postId}")
    public ResponseEntity<Posts> updatePost(
            @PathVariable String postId,
            @RequestBody Posts updatedPost
    ) {
        // Retrieve data from the updatedPost object
        String title = updatedPost.getTitle();
        String caption = updatedPost.getCaption();

        // Update the post in the database using the document ID
        Posts updatedPostData = postAuth.updatePost(postId, title, caption);

        if (updatedPostData != null) {
            // If the post is successfully updated, return it with a 200 OK status
            return ResponseEntity.ok(updatedPostData);
        } else {
            // If the post with the given documentId does not exist, return a 404 Not Found status
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping("/adminupdatepost/{postId}")
    public ResponseEntity<Posts> adminupdatePost(
            @PathVariable String postId,
            @RequestBody Posts updatedPost
    ) {
        // Retrieve data from the updatedPost object
        String title = updatedPost.getTitle();
        String caption = updatedPost.getCaption();

        // Update the post in the database using the document ID
        Posts updatedPostData = postAuth.updatePost(postId, title, caption);

        if (updatedPostData != null) {
            // If the post is successfully updated, return it with a 200 OK status
            return ResponseEntity.ok(updatedPostData);
        } else {
            // If the post with the given documentId does not exist, return a 404 Not Found status
            return ResponseEntity.notFound().build();
        }
    }


    @GetMapping("/getpostbyid/{postId}")
    public ResponseEntity<Posts> getPostById(@PathVariable("postId") String postId) {
        // Call the service method to get the post by its ID
        Posts post = postAuth.getPostByPostId(postId);
        if (post != null) {
            // If the post is found, return it with a 200 OK status
            return ResponseEntity.ok(post);
        } else {
            // If the post is not found, return a 404 Not Found status
            return ResponseEntity.notFound().build();
        }
    }




}
