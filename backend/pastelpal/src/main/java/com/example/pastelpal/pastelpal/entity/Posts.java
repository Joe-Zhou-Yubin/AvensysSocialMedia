package com.example.pastelpal.pastelpal.entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class Posts {
	
	@Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private String postId;
	private String title;
	private String caption;
	private String username;
	private String mediaType;
	private String mediaUrl;
	
	public Posts() {
		
    }

	public Posts(String title, String caption, String username, String mediaType, String mediaUrl) {
        this.postId = generateRandomId();
        this.title = title;
        this.caption = caption;
        this.username = username;
        this.mediaType = mediaType;
        this.mediaUrl = mediaUrl;
    }
	
	private String generateRandomId() {
        String uuid = UUID.randomUUID().toString().replace("-", "");
        return uuid.substring(0, 8);
    }

	public String getPostId() {
		return postId;
	}

	public void setPostId(String postId) {
		this.postId = postId;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getCaption() {
		return caption;
	}

	public void setCaption(String caption) {
		this.caption = caption;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getMediaType() {
		return mediaType;
	}

	public void setMediaType(String mediaType) {
		this.mediaType = mediaType;
	}

	public String getMediaUrl() {
		return mediaUrl;
	}

	public void setMediaUrl(String mediaUrl) {
		this.mediaUrl = mediaUrl;
	}


	@Override
	public String toString() {
		return "Posts [postId=" + postId + ", title=" + title + ", caption=" + caption
				+ ", username=" + username + ", mediaType=" + mediaType + ", mediaUrl=" + mediaUrl + "]";
	}
}
