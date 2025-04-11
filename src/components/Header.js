// src/components/Header.js
import React from 'react';

const Header = () => {
  return (
    <header style={styles.header}>
      {/* Logo / Title Section */}
      <div style={styles.logoContainer}>
        <h1 style={styles.logoText}>Video Information Tracker</h1>
      </div>

      {/* Navigation + Search + Upload */}
      <div style={styles.navContainer}>
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search videos..."
          style={styles.searchInput}
        />

        {/* Simple Nav Links */}
        <nav style={styles.nav}>
          <a href="#" style={styles.navLink}>Home</a>
          <a href="#" style={styles.navLink}>My Videos</a>
          <a href="#" style={styles.navLink}>Profile</a>
        </nav>

        {/* Upload Button */}
        <button style={styles.uploadButton}>
          Upload
        </button>
      </div>
    </header>
  );
};

const styles = {
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#282c34',
    padding: '0.75rem 1.5rem',
    color: '#fff',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  logoText: {
    fontSize: '1.5rem',
    margin: 0,
  },
  navContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  searchInput: {
    padding: '0.5rem',
    marginRight: '1rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '1rem',
  },
  nav: {
    display: 'flex',
    gap: '1rem',
    marginRight: '1rem',
  },
  navLink: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '1rem',
  },
  uploadButton: {
    backgroundColor: '#61dafb',
    color: '#000',
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default Header;
