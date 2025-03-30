// src/components/UploadForm.js
import React, { useState } from 'react';

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle file upload by sending the file to the backend endpoint
  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file first.');
      return;
    }

    // Create a FormData object and append the file
    const formData = new FormData();
    formData.append('file', file);

    try {
      console.log('Sending file upload request...');
      const response = await fetch('http://localhost:9091/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const resultText = await response.text();
      setUploadStatus(resultText);
      console.log('Upload successful:', resultText);
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadStatus("Error uploading file");
    }
  };

  return (
    <div style={styles.uploadContainer}>
      <h2>Upload Your Video</h2>
      <input type="file" accept="video/*" onChange={handleFileChange} />
      <button onClick={handleUpload} style={styles.uploadButton}>Upload</button>
      {uploadStatus && <p>{uploadStatus}</p>}
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
