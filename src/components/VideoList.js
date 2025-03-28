// src/components/VideoList.js
import React from 'react';

const VideoList = () => {
  // Dummy data for now. Later, you'll fetch this from your backend or cloud.
  const videos = [
    { id: 1, title: 'Sample Video 1', url: '#' },
    { id: 2, title: 'Sample Video 2', url: '#' },
  ];

  return (
    <div style={styles.listContainer}>
      <h2>Uploaded Videos</h2>
      <ul style={styles.list}>
        {videos.map((video) => (
          <li key={video.id} style={styles.listItem}>
            <span>{video.title}</span>
            {/* Later, this could be a link or a video preview */}
            <button style={styles.viewButton}>View</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const styles = {
  listContainer: {
    margin: '2rem auto',
    maxWidth: '600px',
  },
  list: {
    listStyleType: 'none',
    padding: 0,
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.5rem',
    borderBottom: '1px solid #ccc',
  },
  viewButton: {
    padding: '0.3rem 0.6rem',
    cursor: 'pointer',
  },
};

export default VideoList;
