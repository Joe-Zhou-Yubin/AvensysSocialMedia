import React, { useState, useEffect } from 'react';
import { Link, useParams , useNavigate} from 'react-router-dom';
import axios from 'axios';

function UpdatePost() {
    const { postId } = useParams();
  const [postTitle, setPostTitle] = useState('');
  const [postCaption, setPostCaption] = useState('');
  const [mediaType, setMediaType] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        // Add the API endpoint for fetching the post data by postId
        const response = await axios.get(`http://localhost:8080/getpostbyid/${postId}`);
        const postData = response.data;

        // Update the state with the retrieved post data
        setPostTitle(postData.title);
        setPostCaption(postData.caption);
        setMediaType(postData.mediaType);
      } catch (error) {
        // Handle errors (e.g., show an error message)
        console.error('Error fetching post data:', error);
        setErrorMessage('Failed to fetch post data. Please try again later.');
      }
    };

    fetchPostData();
  }, [postId]);

  const handlePostUpdate = async () => {
    try {
        // Add the API endpoint for updating a post using the postId from the URL
        const response = await axios.post(`http://localhost:8080/updatepost/${postId}`, {
            title: postTitle,
            caption: postCaption,
            mediaType: mediaType,
            // Add the mediaUrl field if applicable
            // mediaUrl: yourMediaUrlVariable,
        });

        // Handle the response accordingly (e.g., show a success message)
        console.log('Post updated successfully:', response.data);
        navigate('/yourprofile');
    } catch (error) {
        // Handle errors (e.g., show an error message)
        console.error('Error updating post:', error);
        setErrorMessage('Failed to update post. Please try again later.');
    }
};

  return (
    <div className="container mt-5">
      <h1>Update Post</h1>
      <form>
        <div className="form-group">
          <label htmlFor="postTitle">Post Title</label>
          <input
            type="text"
            className="form-control"
            id="postTitle"
            value={postTitle}
            onChange={(e) => setPostTitle(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="postCaption">Post Caption</label>
          <textarea
            className="form-control"
            id="postCaption"
            rows="3"
            value={postCaption}
            onChange={(e) => setPostCaption(e.target.value)}
          />
        </div>
        
        {errorMessage && <p>{errorMessage}</p>}
        <button type="button" className="btn btn-primary" onClick={handlePostUpdate}>
          Update
        </button>
        <Link to="/yourprofile" className="btn btn-secondary ml-2">
          Cancel
        </Link>
      </form>
    </div>
  );
}

export default UpdatePost;
