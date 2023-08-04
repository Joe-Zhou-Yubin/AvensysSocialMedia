import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const boxStyle = {
  backgroundColor: 'white',
  border: '1px solid #ccc',
  borderRadius: '4px',
  padding: '10px',
  margin: '10px',
  display: 'flex', 
  flexDirection: 'column', 
};


const titleStyle = {
  fontSize: '18px',
  fontWeight: 'bold',
};

const captionStyle = {
  fontSize: '14px',
  color: '#666',
};

const usernameStyle = {
  fontSize: '14px',
  color: '#333',
  textAlign: 'right',
  marginTop: 'auto',
  cursor: 'pointer',
};

const buttonStyle = {
    position: 'absolute',
    bottom: '10px',
    left: '10px',
  };

function AdminFeed() {
  const [searchQuery, setSearchQuery] = useState('');
  const [regularPosts, setRegularPosts] = useState([]); // Separate state for regular posts
  const [onlinePosts, setOnlinePosts] = useState([]); // Separate state for online hosted posts
  const [filteredPosts, setFilteredPosts] = useState([]); // Combined state for rendering

    // Fetch posts from the backend API using Axios
    useEffect(() => {
      const fetchPosts = async () => {
        try {
          // Fetch both the regular posts and online hosted posts
          const [responsePosts, responseOnlinePosts] = await Promise.all([
            axios.get('http://localhost:8080/getpost'), // Replace with your regular posts API URL
            axios.get('http://localhost:8080/getonlinepost'), // Replace with your online posts API URL
          ]);
  
          // Set regular posts and online hosted posts separately
          setRegularPosts(responsePosts.data);
          setOnlinePosts(responseOnlinePosts.data);
  
          // Combine both regular posts and online hosted posts
          const allPosts = mergePosts(responsePosts.data, responseOnlinePosts.data);
          setFilteredPosts(allPosts); // Initialize the filtered posts with all posts
        } catch (error) {
          console.error('Error fetching posts:', error);
        }
      };
  
      fetchPosts();
    }, []);
  
    const handleSearch = (event) => {
      const query = event.target.value.toLowerCase();
      setSearchQuery(query);
  
      // Filter posts based on the entered username from the original list of posts
      const filtered = regularPosts.filter((post) =>
        post.username.toLowerCase().includes(query)
      );
      setFilteredPosts(filtered);
    };

  const mergePosts = (regularPosts, onlinePosts) => {
    const uniquePosts = [];
    const postIdSet = new Set();
    regularPosts.forEach((post) => {
      if (!postIdSet.has(post.postId)) {
        uniquePosts.push(post);
        postIdSet.add(post.postId);
      }
    });
    onlinePosts.forEach((post) => {
      if (!postIdSet.has(post.postId)) {
        uniquePosts.push(post);
        postIdSet.add(post.postId);
      }
    });
    return uniquePosts;
  };

  

  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`http://localhost:8080/admindeletepost/${postId}`);
      // Update the filteredPosts state by filtering out the deleted post
      setFilteredPosts((prevFilteredPosts) => prevFilteredPosts.filter((post) => post.postId !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

    return (
      <div className="container mt-5">
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search by username..."
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>
      {filteredPosts.map((post) => (
        <div key={post.postId} className="card mb-3">
          <div className="card-body">
            <h5 className="card-title">{post.title}</h5>
            <p className="card-text">{post.caption}</p>
            {post.mediaType === 'photo' && (
              <img src={post.mediaUrl} className="card-img-top" alt="Post Media" />
            )}
            {post.mediaType === 'video' && (
              <video className="card-img-top" controls>
                <source src={post.mediaUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
            {post.mediaType === 'online' && (
              <img src={post.mediaUrl} className="card-img-top" alt="Online Media" />
            )}
            <Link to={`/profile/${post.username}`}>
              <div style={usernameStyle}>Posted by: {post.username}</div>
            </Link>
            <div style={buttonStyle}>
              <Link to={`/adminupdatepost/${post.postId}`} className="btn btn-primary mr-2">
                Update
              </Link>
              <button className="btn btn-danger" onClick={() => handleDeletePost(post.postId)}>
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
    );
}

export default AdminFeed