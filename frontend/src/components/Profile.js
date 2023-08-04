import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
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
const containerStyle = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const titleStyle = {
  fontSize: '25px',
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
};


function Profile() {
  const { username } = useParams();
  const [userRegularPosts, setUserRegularPosts] = useState([]); // Separate state for regular posts
  const [userOnlinePosts, setUserOnlinePosts] = useState([]); // Separate state for online hosted posts

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        // Fetch both the regular posts and online hosted posts for the specific username
        const [responseRegularPosts, responseOnlinePosts] = await Promise.all([
          axios.get(`http://localhost:8080/getpost/${username}`),
          axios.get(`http://localhost:8080/getonlinepost/${username}`),
        ]);

        // Set regular posts and online hosted posts separately
        setUserRegularPosts(filterOnlinePosts(responseRegularPosts.data));
        setUserOnlinePosts(responseOnlinePosts.data);
      } catch (error) {
        console.error('Error fetching user posts:', error);
      }
    };

    fetchUserPosts();
  }, [username]);

  // Filter out online posts from regular posts
  const filterOnlinePosts = (regularPosts) => {
    return regularPosts.filter((post) => post.mediaType !== 'online');
  };

  return (
    <div className="container mt-5">
      <div style={containerStyle}>
        <Link to="/feed" className="btn btn-primary mb-2">
          {'< Back to Feed'}
        </Link>
        <h2 style={titleStyle}>{username}'s Profile</h2>
        <br />
      </div>
      {userRegularPosts.map((post) => (
        <div key={post.id} className="card mb-3">
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
            <div style={usernameStyle}>{post.username}</div>
          </div>
        </div>
      ))}
      {userOnlinePosts.map((post) => (
        <div key={post.id} className="card mb-3">
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
            <div style={usernameStyle}>Posted by: {post.username}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Profile