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
      // Ensure the URL is absolute
      const fullUrl = imagePath.startsWith('http') 
        ? imagePath 
        : `${API_BASE_URL}${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`;
      
      console.log('Downloading from URL:', fullUrl); // Debug log
      
      // Fetch the image with proper headers
      const response = await fetch(fullUrl, {
        headers: {
          'Accept': 'image/*'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Get content type and blob
      const contentType = response.headers.get('content-type');
      console.log('Content-Type:', contentType); // Debug log
      
      const blob = await response.blob();
      console.log('Blob type:', blob.type); // Debug log
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      // Extract filename and ensure proper extension
      let filename = imagePath.split('/').pop() || 'downloaded-image';
      
      // If filename doesn't have an extension, add one based on content type
      if (!filename.includes('.')) {
        const extension = contentType?.split('/')[1] || 'jpg';
        filename = `${filename}.${extension}`;
      }
      
      console.log('Downloading file:', filename); // Debug log
      a.download = filename;
      
      // Trigger download
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download image. Please try again.");
    }
  }

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
