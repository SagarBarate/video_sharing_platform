// src/App.js
import React from 'react';
import './App.css';
import Header from './components/Header';
 import UploadForm from './components/UploadForm';
import VideoList from './components/VideoList';

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <UploadForm />
        <VideoList />
      </main>
    </div>
  );
}

export default App;
