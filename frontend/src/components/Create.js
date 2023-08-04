import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid'; 
import axios from 'axios';
import 'firebase/compat/storage';
import { ref, uploadBytes,getDownloadURL } from '@firebase/storage';
import { storage } from '../firebase';

const Create = () => {
  const [postTitle, setPostTitle] = useState('');
  const [postCaption, setPostCaption] = useState('');
  const [mediaType, setMediaType] = useState('');
  const [mediaFile, setMediaFile] = useState(null);
  const [onlineMediaUrl, setOnlineMediaUrl] = useState(''); // New state for online media URL
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileExtension = file.type.split('/')[1];

      // Check if the selected media type matches the file format
      if (mediaType === 'photo' && (fileExtension === 'jpeg' || fileExtension === 'png')) {
        setMediaFile(file);
        setErrorMessage('');
      } else if (mediaType === 'video' && (fileExtension === 'mp4' || fileExtension === 'avi')) {
        setMediaFile(file);
        setErrorMessage('');
      } else {
        // Invalid file format for the selected media type
        // Reset the media type and media file state and display error message
        setMediaType('');
        setMediaFile(null);
        setErrorMessage(
          mediaType === 'photo'
            ? 'Invalid photo format, please upload in .jpeg or .png format only'
            : 'Invalid video format, please upload in .mp4 or .avi format only'
        );
      }
    }
  };

  const handlePost = async () => {
    let mediaUrl = null; // Initialize mediaUrl as null
  
    if (mediaFile) {
      // If mediaFile exists, proceed with media upload
      // Generate a unique filename using uuid
      const uniqueFilename = `${uuidv4()}_${mediaFile.name}`;
  
      // Create a reference to the storage location based on the media type
      const storageRef = ref(storage, uniqueFilename)
  
      // Create file metadata including the content type
      const metadata = {
        contentType: mediaType === 'photo' ? 'image/jpeg' : 'video/mp4',
      };
  
      try {
        // Upload the file and metadata using uploadBytes
        await uploadBytes(storageRef, mediaFile, metadata);
  
        // Get the download URL of the uploaded media file
        mediaUrl = await getDownloadURL(storageRef);
      } catch (error) {
        console.error('Error uploading media:', error);
        return; // Abort the post creation if media upload fails
      }
    }
  
    // Send the post data including mediaUrl to the backend through the '/createpost' API endpoint
    const postData = {
      title: postTitle,
      caption: postCaption,
      mediaType: mediaType,
      mediaUrl: mediaType === 'online' ? onlineMediaUrl : mediaUrl, // Use onlineMediaUrl if mediaType is "Online Media"
    };
  
    // Make a POST request to the backend '/createpost' endpoint using Axios or any other HTTP client library
    // Pass the 'postData' object as the request body
    // Example using Axios:
    try {
      await axios.post('http://localhost:8080/createpost', postData);
      // Redirect back to the Feed page (assuming the route is '/feed')
      navigate('/feed');
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h1>Create a New Post</h1>
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
        <div className="form-group">
          <label htmlFor="mediaType">Media Type</label>
          <select
            className="form-control"
            id="mediaType"
            value={mediaType}
            onChange={(e) => setMediaType(e.target.value)}
          >
            <option value="">Select Media Type</option>
            <option value="online">Online Media</option>
            <option value="photo">Photo</option>
            <option value="video">Video</option>
          </select>
        </div>
        {errorMessage && <p>{errorMessage}</p>}
        {mediaType === 'online' && ( // Render the input box for online media URL
          <div className="form-group">
            <label htmlFor="onlineMediaUrl">Online Media URL:</label>
            <input
              type="text"
              className="form-control"
              id="onlineMediaUrl"
              value={onlineMediaUrl}
              onChange={(e) => setOnlineMediaUrl(e.target.value)}
            />
          </div>
        )}
        {mediaType !== 'online' && ( // Render the file upload button for photo and video
          <div className="form-group">
            <label htmlFor='mediaFile'>Media File:</label>
            <input
              type="file"
              accept={mediaType === 'photo' ? 'image/jpeg, image/png' : 'video/mp4, video/avi'}
              onChange={handleFileChange}
            />
          </div>
        )}
        <button type="button" className="btn btn-primary" onClick={handlePost}>
          Post
        </button>
      </form>
    </div>
  );
};

export default Create;
