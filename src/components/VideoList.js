// src/components/VideoList.js
import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';

const VideoList = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Function to fetch videos from the backend API
  const fetchVideos = async () => {
    try {
      const response = await fetch('http://localhost:9091/api/videos');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setVideos(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching videos:', err);
      setError('Error fetching videos');
      setLoading(false);
    }
  };

  // Run fetchVideos when the component mounts
  useEffect(() => {
    fetchVideos();
  }, []);

  // Function to handle deletion of a video
  const handleDelete = async (videoUrl) => {
    // Extract the file name from the video URL.
    // This assumes that your video URL ends with the file name.
    const parts = videoUrl.split('/');
    const fileName = parts.pop();

    try {
      const response = await fetch(`http://localhost:9091/api/delete/${fileName}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete file');
      }
      const resultText = await response.text();
      console.log(resultText);
      // Refresh the video list after deletion
      fetchVideos();
    } catch (err) {
      console.error('Error deleting video:', err);
    }
  };

  return (
    <div style={styles.listContainer}>
      <h2>Uploaded Videos</h2>
      {loading && <p>Loading videos...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && videos.length === 0 && <p>No videos available.</p>}
      {!loading && !error && videos.length > 0 && (
        <div style={styles.videoGrid}>
          {videos.map((video, index) => (
            <div key={index} style={styles.videoItem}>
              <ReactPlayer url={video} controls width="320px" height="240px" />
              <p style={styles.videoUrl}>{video}</p>
              <button style={styles.deleteButton} onClick={() => handleDelete(video)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  listContainer: {
    margin: '2rem auto',
    maxWidth: '800px',
    padding: '1rem',
    background: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  videoGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  videoItem: {
    flex: '1 1 320px',
    textAlign: 'center',
    border: '1px solid #ccc',
    padding: '0.5rem',
    borderRadius: '4px',
  },
  videoUrl: {
    fontSize: '0.8rem',
    wordBreak: 'break-all',
  },
  deleteButton: {
    marginTop: '0.5rem',
    padding: '0.3rem 0.6rem',
    fontSize: '0.9rem',
    color: '#fff',
    backgroundColor: '#e74c3c',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default VideoList;
