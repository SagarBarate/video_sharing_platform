// src/components/UploadForm.js
import React, { useState } from 'react';

const UploadForm = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [xmlFile, setXmlFile] = useState(null);
  const [teamName, setTeamName] = useState('');
  const [softwareName, setSoftwareName] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [metadata, setMetadata] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // ------------------------------
  // Handlers
  // ------------------------------
  
  // Video and XML file selection
  const handleVideoChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleXmlChange = (e) => {
    setXmlFile(e.target.files[0]);
  };

  // Text field updates
  const handleTeamNameChange = (e) => {
    setTeamName(e.target.value);
  };

  const handleSoftwareNameChange = (e) => {
    setSoftwareName(e.target.value);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleMetadataChange = (e) => {
    setMetadata(e.target.value);
  };

  // Upload logic
  const handleUpload = async () => {
    if (!videoFile) {
      alert('Please select a video file.');
      return;
    }

    setIsUploading(true);
    setUploadStatus('');

    // Create FormData
    const formData = new FormData();
    formData.append('videoFile', videoFile);
    if (xmlFile) {
      formData.append('xmlFile', xmlFile);
    }
    formData.append('teamName', teamName);
    formData.append('softwareName', softwareName);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('metadata', metadata);

    // Send to backend
    try {
      const response = await fetch('http://localhost:9091/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const resultText = await response.text();
      setUploadStatus(resultText || 'Upload successful!');
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadStatus('Error uploading file');
    } finally {
      setIsUploading(false);
    }
  };

  // ------------------------------
  // Render
  // ------------------------------
  
  return (
    <div style={styles.uploadContainer}>
      <h2 style={styles.heading}>Asset Management Upload</h2>
      <p style={styles.subHeading}>
        Upload your video asset along with optional XML/project data 
        and metadata for collaborative video editing.
      </p>

      {/* Team Name */}
      <div style={styles.formGroup}>
        <label htmlFor="teamName" style={styles.label}>Team Name</label>
        <input
          type="text"
          id="teamName"
          value={teamName}
          onChange={handleTeamNameChange}
          style={styles.input}
          placeholder="Enter your team name"
        />
      </div>

      {/* Software Name */}
      <div style={styles.formGroup}>
        <label htmlFor="softwareName" style={styles.label}>Editing Software</label>
        <input
          type="text"
          id="softwareName"
          value={softwareName}
          onChange={handleSoftwareNameChange}
          style={styles.input}
          placeholder="E.g., Premiere Pro, DaVinci Resolve, Final Cut Pro..."
        />
      </div>

      {/* Title */}
      <div style={styles.formGroup}>
        <label htmlFor="title" style={styles.label}>Asset Title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={handleTitleChange}
          style={styles.input}
          placeholder="Enter a descriptive title"
        />
      </div>

      {/* Description */}
      <div style={styles.formGroup}>
        <label htmlFor="description" style={styles.label}>Description</label>
        <textarea
          id="description"
          value={description}
          onChange={handleDescriptionChange}
          style={{ ...styles.input, height: '4rem', resize: 'vertical' }}
          placeholder="Short description of this asset..."
        />
      </div>

      {/* Video File */}
      <div style={styles.formGroup}>
        <label htmlFor="videoFile" style={styles.label}>Video File</label>
        <input
          type="file"
          accept="video/*"
          id="videoFile"
          onChange={handleVideoChange}
          style={styles.fileInput}
        />
      </div>

      {/* XML File (Optional) */}
      <div style={styles.formGroup}>
        <label htmlFor="xmlFile" style={styles.label}>XML/Project File (Optional)</label>
        <input
          type="file"
          accept=".xml"
          id="xmlFile"
          onChange={handleXmlChange}
          style={styles.fileInput}
        />
      </div>

      {/* Additional Metadata */}
      <div style={styles.formGroup}>
        <label htmlFor="metadata" style={styles.label}>Additional Metadata (JSON, etc.)</label>
        <textarea
          id="metadata"
          value={metadata}
          onChange={handleMetadataChange}
          style={{ ...styles.input, height: '4rem', resize: 'vertical' }}
          placeholder='{"key1": "value1", "key2": "value2"}'
        />
      </div>

      {/* Upload Button & Status */}
      <button
        onClick={handleUpload}
        style={styles.uploadButton}
        disabled={isUploading}
      >
        {isUploading ? 'Uploading...' : 'Upload'}
      </button>

      {uploadStatus && <p style={styles.statusMessage}>{uploadStatus}</p>}
    </div>
  );
};

// ------------------------------
// Inline Styles
// ------------------------------
const styles = {
  uploadContainer: {
    margin: '2rem auto',
    padding: '1.5rem 2rem',
    border: '1px solid #ccc',
    borderRadius: '8px',
    maxWidth: '600px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    backgroundColor: '#fff',
  },
  heading: {
    margin: '0 0 1rem 0',
    fontWeight: 'bold',
    fontSize: '1.75rem',
    color: '#333',
    textAlign: 'center',
  },
  subHeading: {
    margin: '0 0 2rem 0',
    fontSize: '1rem',
    color: '#666',
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: '1.25rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: 600,
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '0.5rem',
    fontSize: '1rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
    outline: 'none',
  },
  fileInput: {
    width: '100%',
    padding: '0.25rem 0',
  },
  uploadButton: {
    marginTop: '1rem',
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    cursor: 'pointer',
    backgroundColor: '#61dafb',
    border: 'none',
    borderRadius: '4px',
    color: '#000',
    transition: 'background-color 0.3s ease',
  },
  statusMessage: {
    marginTop: '1.5rem',
    fontSize: '1rem',
    color: '#333',
    whiteSpace: 'pre-wrap',
    textAlign: 'center',
  },
};

export default UploadForm;
