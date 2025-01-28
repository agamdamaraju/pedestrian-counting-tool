import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file to upload!');
      return;
    }

    const formData = new FormData();
    formData.append('video', selectedFile);

    try {
      setIsProcessing(true);
      const response = await axios.post('http://10.58.9.244:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data && response.data.videoUrl) {
        setUploadedVideo(response.data.videoUrl);
      } else {
        alert('Video uploaded but no URL returned. Check server response.');
      }
    } catch (error) {
      console.error('Error uploading video:', error);
      alert('Error uploading video. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f3f3f3' }}>
      <div style={{ width: '100%', maxWidth: '500px', padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
        <h1 style={{ fontSize: '24px', marginBottom: '20px', textAlign: 'center' }}>PEDESTRIAN COUNTING TOOL</h1>
        <input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          style={{ display: 'block', width: '95%', marginBottom: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
        />
        <button
          onClick={handleUpload}
          disabled={isProcessing || !selectedFile}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: isProcessing ? '#ccc' : '#007BFF',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isProcessing ? 'not-allowed' : 'pointer',
          }}
        >
          {isProcessing ? 'Processing...' : 'Upload Video'}
        </button>

        {uploadedVideo && (
          <div style={{ marginTop: '20px' }}>
            <h2 style={{ fontSize: '18px', marginBottom: '10px' }}>Processed Video:</h2>
            <video controls style={{ width: '100%' }}>
              <source src={`http://10.58.9.244:5000${uploadedVideo}`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <a
              href={`http://10.58.9.244:5000${uploadedVideo}`}
              download
              style={{ display: 'block', marginTop: '10px', color: '#007BFF', textDecoration: 'underline', textAlign: 'center' }}
            >
              Download Processed Video
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
