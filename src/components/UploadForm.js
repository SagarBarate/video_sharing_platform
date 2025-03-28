// src/components/UploadForm.js
import React, { useState } from 'react';

const UploadForm = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    // For now, we’ll log the file. Later, integrate with your backend/AWS S3.
    if (file) {
      console.log('Uploading file:', file);
      // TODO: Implement file upload functionality
      alert(`Uploading ${file.name}`);
    } else {
      alert('Please select a file first.');
    }
  };

  return (
    <div style={styles.uploadContainer}>
      <h2>Upload Your Video</h2>
      <input type="file" accept="video/*" onChange={handleFileChange} />
      <button onClick={handleUpload} style={styles.uploadButton}>Upload</button>
    </div>
  );
};

const styles = {
  uploadContainer: {
    margin: '2rem auto',
    padding: '1rem',
    border: '1px solid #ccc',
    borderRadius: '8px',
    maxWidth: '500px',
    textAlign: 'center',
  },
  uploadButton: {
    marginTop: '1rem',
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    cursor: 'pointer',
  },
};

export default UploadForm;
