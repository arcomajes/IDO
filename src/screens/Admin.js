"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import "./Admin.css"

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

  const handleDownload = async (imagePath) => {
    try {
      const fullUrl = imagePath.startsWith('http') 
        ? imagePath 
        : `${API_BASE_URL}${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`;
  
      const response = await fetch(fullUrl, {
        headers: { 'Accept': 'image/*' },
        mode: 'cors'
      });
  
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  
      const contentType = response.headers.get('content-type');
      const arrayBuffer = await response.arrayBuffer();
      const blob = new Blob([arrayBuffer], { type: contentType || 'image/jpeg' });
  
      // Extract filename from URL
      const urlPath = new URL(fullUrl).pathname;
      let filename = urlPath.split('/').pop() || 'downloaded-image';
  
      // Determine extension from Content-Type or filename
      const extFromContent = contentType?.split('/')[1] || 'jpg';
      const extFromFilename = filename.split('.').pop().toLowerCase();
      const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
  
      // Use valid extension from Content-Type if filename's is invalid
      const validExt = validExtensions.includes(extFromFilename) 
        ? extFromFilename 
        : validExtensions.includes(extFromContent) 
          ? extFromContent 
          : 'jpg';
  
      // Ensure filename has valid extension
      if (!filename.includes('.') || !validExtensions.includes(extFromFilename)) {
        filename = `${filename.split('.')[0]}.${validExt}`;
      }
  
      // Trigger download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download image. Please try again.");
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
