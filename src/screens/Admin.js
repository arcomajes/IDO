"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import "./Admin.css"
import mime from 'mime-types';

export default function Admin() {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null); // For image modal
  const navigate = useNavigate();
  const API_BASE_URL = "https://ido-cvwh.onrender.com";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");

    const fetchMemories = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/memories`, {
          headers: { 
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        });
        console.log("API Response:", res.data); // Debugging log
        
        if (Array.isArray(res.data)) {
          // Ensure all image URLs are absolute
          const formattedMemories = res.data.map(memory => ({
            ...memory,
            images: memory.images.map(img => {
              if (img.startsWith('http')) return img;
              return `${API_BASE_URL}${img}`;
            })
          }));
          setMemories(formattedMemories);
        } else {
          console.error("Invalid response format:", res.data);
          setMemories([]); // Fallback to empty array
        }
      } catch (error) {
        console.error("Error fetching memories:", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchMemories();
    // Refresh memories every 30 seconds
    const interval = setInterval(fetchMemories, 30000);
    return () => clearInterval(interval);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  const handleDownload = async (imageUrl) => {
    try {
      // Fetch with cache-busting
      const response = await fetch(`${imageUrl}?t=${Date.now()}`);
      
      // Get metadata from headers
      const contentType = response.headers.get('content-type');
      const contentDisposition = response.headers.get('content-disposition');
      
      // Extract filename with priority:
      // 1. Content-Disposition header
      // 2. URL path
      let filename = contentDisposition 
        ? contentDisposition.split('filename=')[1].replace(/"/g, '')
        : imageUrl.split('/').pop();
  
      // Add extension if missing
      if (!filename.includes('.')) {
        const ext = mime.extension(contentType) || 'bin';
        filename = `${filename}.${ext}`;
      }
  
      // Create download
      const blob = await response.blob();
      const tempLink = document.createElement('a');
      tempLink.href = URL.createObjectURL(blob);
      tempLink.download = filename;
      tempLink.style.display = 'none';
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
      URL.revokeObjectURL(tempLink.href);
  
    } catch (error) {
      console.error('Download error:', error);
      alert('Error downloading image. Please try again.');
    }
  };
  
  const handleImageClick = (image) => {
    setSelectedImage(image)
  }

  const closeModal = () => {
    setSelectedImage(null)
  }

  if (loading) return <div className="loading">Loading...</div>

  return (
    <div className="main-container">
      <div className="header">
        <h1 className="title">Admin Dashboard</h1>
        <button onClick={handleLogout} className="logout-button">
          Log Out
        </button>
      </div>
      <div className="memory-grid">
        {memories.map((memory) =>
          memory.images.map((image, index) => (
            <div key={`${memory._id}-${index}`} className={`memory-card color-${index % 3}`}>
              <div className="image-container" onClick={() => handleImageClick(image)}>
              <img 
                src={image} 
                alt={`Memory ${index + 1}`} 
                className="memory-image" 
                onClick={() => handleImageClick(image)}
              />
              </div>
              <div className="card-content">
                <h2 className="memory-title">Memory {index + 1}</h2>
                <p className="memory-info">
                  <span className="info-icon">👤</span> Name: {memory.name || "Anonymous"}
                </p>
                <p className="memory-info">
                  <span className="info-icon">💬</span> Message: {memory.message || "No message provided"}
                </p>
                <div className="card-footer">
                  <div className="indicator-dots">
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                  </div>
                  <button onClick={() => handleDownload(image)} className="download-button">
                    Download
                  </button>
                </div>
              </div>
            </div>
          )),
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closeModal}>✖</button>
            <img src={selectedImage} alt="Selected Memory" className="modal-image" />
          </div>
        </div>
      )}
    </div>
  )
}
