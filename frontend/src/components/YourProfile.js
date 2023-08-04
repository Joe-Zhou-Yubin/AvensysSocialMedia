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

const buttonStyle = {
    position: 'absolute',
    bottom: '10px',
    left: '10px',
  };

function YourProfile() {
    const { username } = useParams();
    const [userPosts, setUserPosts] = useState([]);
    const [userOnlinePosts, setOnlineUserPosts] = useState([]);

    useEffect(() => {
      const fetchUserPosts = async () => {
        try {
          const [responseRegularPosts, responseOnlinePosts] = await Promise.all([
            axios.get(`http://localhost:8080/getonlinepost`),
            axios.get(`http://localhost:8080/getonlineonlinepost`),
          ]);
          
          // Set regular posts and online hosted posts separately
          setUserPosts(filterOnlinePosts(responseRegularPosts.data));
          setOnlineUserPosts(responseOnlinePosts.data);
        } catch (error) {
          console.error('Error fetching user posts:', error);
        }
      };
  
      fetchUserPosts();
    }, [username]);

    const filterOnlinePosts = (regularPosts) => {
      return regularPosts.filter((post) => post.mediaType !== 'online');
    };

    const handleDeletePost = async (postId) => {
        try {
          await axios.delete(`http://localhost:8080/deletepost/${postId}`);
          // Update the userPosts state by filtering out the deleted post
          setUserPosts((prevUserPosts) => prevUserPosts.filter((post) => post.id !== postId));
          window.location.reload();
        } catch (error) {
          console.error('Error deleting post:', error);
        }
      };
  
      return (
        <div className="container mt-5">
          <div style={containerStyle}>
            <Link to="/feed" className="btn btn-primary mb-2">
              {'< Back to Feed'}
            </Link>
            <h2 style={titleStyle}>Your Profile</h2>
            <br />
          </div>
          {userPosts.map((post) => (
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
                <div style={usernameStyle}>Posted by: {post.username}</div>
              </div>
              <div>
                <div style={buttonStyle}>
                  <Link to={`/updatepost/${post.postId}`} className="btn btn-primary mr-2">
                    Update
                  </Link>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeletePost(post.postId)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          {/* Add the section to display online hosted posts */}
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
                <div style={usernameStyle}>{post.username}</div>
              </div>
              <div>
                <div style={buttonStyle}>
                  <Link to={`/updatepost/${post.postId}`} className="btn btn-primary mr-2">
                    Update
                  </Link>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeletePost(post.postId)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
      
}

export default YourProfile