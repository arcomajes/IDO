"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import "./Admin.css"

export default function Admin() {
  const [memories, setMemories] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(null) // For image modal
  const navigate = useNavigate()
  const API_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5001";

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) navigate("/login")

    const fetchMemories = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/memories`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setMemories(res.data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching memories:", error)
        navigate("/login")
      }
    }
    fetchMemories()
  }, [navigate, API_URL])

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  const handleDownload = async (imagePath) => {
    try {
      const response = await fetch(`${API_URL}/${imagePath}`)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = imagePath.split("/").pop()
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Download error:", error)
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
              <div className="image-container" onClick={() => handleImageClick(`${API_URL}/${image}`)}>
                <img src={`${API_URL}/${image}`} alt={`Memory ${index + 1}`} className="memory-image" />
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
