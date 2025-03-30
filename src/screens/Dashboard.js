import { Card, CardContent } from "src/components/cards";
import { MapPin, Heart, Calendar } from "lucide-react";
import { Button } from "src/components/button";
import 'src/styles.css';
import React, { useState } from "react";
import axios from "axios";
//test push
export default function Dashboard() {
  const [name, setName] = useState("");
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState("");
  
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 10) {
      alert("You can only upload up to 10 images.");
      return;
    }
    setImages([...images, ...files]);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (images.length === 0) {
      alert("Please upload at least one image.");
      return;
    }
  
    const formData = new FormData();
    formData.append("name", name || "Anonymous"); // Allow anonymous upload
    images.forEach((image) => formData.append("images", image));
    formData.append("message", message || ""); // Allow empty messages
  
    try {
      await axios.post("http://localhost:5001/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Memory uploaded successfully!");
      setName("");
      setImages([]);
      setMessage("");
    } catch (err) {
      alert("Upload failed. Please try again.");
    }
  };
  

  const weddingDetails = {
    couple: {
      name1: "Kevin",
      name2: "Estrel",
    },
    date: "April 6, 2025",
    day: "Saturday",
    time: "2:30 PM",
    ceremonyLocation: "St. Mary's Cathedral",
    ceremonyAddress: "123 Wedding Lane, Cityville",
    receptionLocation: "Grand Ballroom, Luxury Hotel",
    receptionAddress: "456 Celebration Ave, Cityville",
  };

  return (
    <div className="min-h-screen bg-red-800 text-white">
      {/* Top Navigation */}
      <nav className="sticky-nav"> {/* Apply your CSS here */}
        <div className="nav-container">
          <div className="couple-name">
            {weddingDetails.couple.name1} & {weddingDetails.couple.name2}
          </div>
          <div className="nav-links">
            <a href="#overview">Overview</a>
            <a href="#schedule">Schedule</a>
            <a href="#locations">Locations</a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="p-6 md:p-10 overflow-auto w-full">
        <div className="max-w-5xl mx-auto">
          
          {/* Hero Section */}
          <section id="overview" className="mb-16">
  <div className="overview-hero">
    <div className="overlay-text">Kevin & Estrel</div>
    <img
      src="/images/bg.jpg"
      alt="Wedding Background"
      className="overview-hero-image"
    />
    <div className="hero-gradient">
      <div className="hero-content">
        <h1>Join Our Greatest Adventure</h1>
        <p>We invite you to celebrate our wedding day</p>
        <div className="hero-buttons">
          <Button className="btn btn-primary">RSVP</Button>
          <Button className="btn btn-outline">View Details</Button>
        </div>
      </div>
    </div>
  </div>

  <div className="grid-container">
    {/* Wedding Date Card */}
    <Card id="schedule" className="card">
      <CardContent className="card-content">
        <Calendar className="card-icon" />
        <h3>Wedding Date</h3>
        <p>{weddingDetails.date}</p>
        <p>{weddingDetails.day}</p>
      </CardContent>
    </Card>

    {/* Locations Card */}
    <Card className="card">
      <CardContent className="card-content">
        <MapPin className="card-icon" />
        <h3>Locations</h3>
        <p>Ceremony & Reception</p>
        <p className="text-sm">See details below</p>
      </CardContent>
    </Card>
  </div>
</section>

{/* Locations Section */}
<section id="locations" className="mb-16">
  <div className="location-grid">
    {/* Ceremony Card */}
    <Card className="location-card">
      <CardContent className="card-content">
        <div className="location-card-header">
          <div className="location-icon">
            <Heart className="location-icon-svg" />
          </div>
          <div>
            <h3 className="location-title">Ceremony</h3>
            <p className="location-subtitle">{weddingDetails.ceremonyLocation}</p>
          </div>
        </div>
        <p className="location-address">{weddingDetails.ceremonyAddress}</p>
        <div className="map-placeholder">
          <MapPin />
          <span>Map placeholder</span>
        </div>
        <Button className="btn btn-location">Get Directions</Button>
      </CardContent>
    </Card>
  </div>
</section>

          {/* Photos Section */}
<section id="photos" className="mb-16">
  <div className="section-header">
  <div className="divider"></div>
    <h2>Photos</h2>
    <div className="divider"></div>
  </div>
  <div className="photo-upload-card">
    <p className="text-center text-gray-700">
      Share your photos from our special day using our wedding hashtag:
    </p>
    <div className="hashtag-display">#KevinAndEstrelWedding</div>
    <div className="upload-form">
      <h2>Upload Memories</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Your Name:</label>
          <input 
            type="text" 
            className="form-control" 
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Upload Images (Max 10):</label>
          <div className="file-input-container">
            <label className="file-input-label">
              Click to select photos
              <input 
                type="file" 
                className="file-input" 
                multiple 
                onChange={handleImageUpload}
              />
            </label>
          </div>
          <div className="image-preview-grid">
            {images.map((img, index) => (
              <img 
                key={index} 
                src={URL.createObjectURL(img)} 
                className="image-preview" 
                alt={`Preview ${index + 1}`}
              />
            ))}
          </div>
        </div>
        <div className="form-group">
          <label>Your Message/Wishes:</label>
          <textarea 
            className="form-control" 
            rows="3"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
        </div>
        <button type="submit" className="submit-btn">Upload Memory</button>
      </form>
    </div>
  </div>
</section>

{/* RSVP Section */}
<section id="rsvp" className="mb-16">
  <div className="section-header">
  <div className="divider"></div>
    <h2>RSVP</h2>
    <div className="divider"></div>
  </div>
  <div className="rsvp-card">
    <div className="rsvp-header">
      <h3>We hope you can join us!</h3>
      <p>Please RSVP by March 6, 2025</p>
    </div>
    {/* RSVP form would go here */}
  </div>
</section>

          {/* Footer */}
          <footer className="footer">
            <div className="footer-hearts"></div>
            <p>Kevin & Estrel Wedding</p>
            <p>April 6, 2025 | Cityville</p>
            <p>
              Made with <Heart className="heart-icon" /> for our special day
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}