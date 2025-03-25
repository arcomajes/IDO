import { Card, CardContent } from "src/components/cards";
import { MapPin, Heart, Calendar } from "lucide-react";
import { Button } from "src/components/button";
import 'src/styles.css';
import React, { useState } from "react";
import axios from "axios";

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
    <div className="min-h-screen bg-red-800 text-whit">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-red-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-description">
                {weddingDetails.couple.name1} & {weddingDetails.couple.name2}
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#overview" className="text-description hover:text-red-700">Overview</a>
              <a href="#schedule" className="text-description hover:text-red-700">Schedule</a>
              <a href="#locations" className="text-description hover:text-red-700">Locations</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="p-6 md:p-10 overflow-auto w-full">
        <div className="max-w-5xl mx-auto">
          
          {/* Hero Section */}
          <section id="overview" className="mb-16">
            <div className="relative rounded-xl overflow-hidden h-[400px] mb-8">
              <div className="relative w-full h-full">
                <div class="overlay-text">Kevin & Estrel</div>

                <div className="wedding-details">
                  <img
                    src="/images/airplane-map.png"
                    alt="Wedding Boarding Pass"
                    className="wedding-image"
                  />
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-red-900/70 to-transparent flex items-center">
                <div className="p-8 text-white max-w-md">
                  <h1 className="text-subtitle">Join Our Greatest Adventure</h1>
                  <p className="text-description mb-6 animate-fade-in">
                    We invite you to celebrate our wedding day
                  </p>
                  <div className="flex space-x-4">
                    <Button className="bg-white text-red-900 hover:bg-red-100">RSVP</Button>
                    <Button variant="outline" className="border-white text-white hover:bg-red-800">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>

              

              <div className="grid-container">
                {/* Wedding Date Card */}
                <Card className="border-red-200">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <Calendar className="h-10 w-10 text-red-800 mb-4" />
                    <h3 className="text-subtitle font-semibold mb-2">Wedding Date</h3>
                    <p className="text-description">{weddingDetails.date}</p>
                    <p className="text-description">{weddingDetails.day}</p>
                  </CardContent>
                </Card>

                {/* Locations Card */}
                <Card className="border-red-200">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <MapPin className="h-10 w-10 text-red-800 mb-4" />
                    <h3 className="text-subtitle font-semibold mb-2">Locations</h3>
                    <p className="text-description">Ceremony & Reception</p>
                    <p className="text-description text-sm">See details below</p>
                  </CardContent>
                </Card>
              </div>
              


              
            </div>
          </section>

          {/* Locations Section */}
          <section id="locations" className="mb-16">
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Ceremony Card */}
              <Card className="border-red-200">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mr-4">
                      <Heart className="h-6 w-6 text-red-800" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">Ceremony</h3>
                      <p className="text-gray-600">{weddingDetails.ceremonyLocation}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">{weddingDetails.ceremonyAddress}</p>
                  <div className="h-40 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                    <MapPin className="h-8 w-8 text-gray-400" />
                    <span className="ml-2 text-gray-500">Map placeholder</span>
                  </div>
                  <Button variant="outline" className="w-full border-red-800 text-red-800 hover:bg-red-50">
                    Get Directions
                  </Button>
                </CardContent>
              </Card>
              
            </div>
          </section>

          {/* Photos Section */}
          <section id="photos" className="mb-16">
            <div className="flex items-center mb-6">
              <h2 className="text-3xl font-semibold text-red-900">Photos</h2>
              <div className="ml-4 flex-1 h-px bg-red-200"></div>
            </div>
            <Card className="border-red-200">
              <CardContent className="p-6">
                <p className="text-center text-gray-700 mb-8">
                  Share your photos from our special day using our wedding hashtag:
                </p>
                <div className="text-center mb-8">
                  <span className="text-2xl font-semibold text-red-900">#KevinAndEstrelWedding</span>
                </div>
                <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-2xl font-semibold text-center mb-4">Upload Memories</h2>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label className="block font-medium mb-1">Your Name:</label>
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block font-medium mb-1">Upload Images (Max 10):</label>
                      <input type="file" accept="image/*" multiple onChange={handleImageUpload} />
                      <CardContent className="p-0">
                        <div className="flex flex-wrap gap-2 mt-2">
                        {images.map((img, index) => (
                          <img
                            key={index}
                            src={URL.createObjectURL(img)}
                            alt="preview"
                            className="h-16 w-16 object-cover rounded"
                          />
                        ))}
                      </div>
                      </CardContent>
                      
                    </div>

                    <div className="mb-4">
                      <label className="block font-medium mb-1">Your Message/Wishes:</label>
                      <textarea
                        className="w-full p-2 border border-gray-300 rounded"
                        rows="3"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-red-700 text-white py-2 rounded hover:bg-red-800"
                    >
                      Upload Memory
                    </button>
                  </form>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* RSVP Section */}
          <section id="rsvp" className="mb-16">
            <div className="flex items-center mb-6">
              <h2 className="text-3xl font-semibold text-red-900">RSVP</h2>
              <div className="ml-4 flex-1 h-px bg-red-200"></div>
            </div>
            <Card className="border-red-200">
              <CardContent className="p-6">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-script text-red-900 mb-2">We hope you can join us!</h3>
                  <p className="text-gray-700">Please RSVP by March 6, 2025</p>
                </div>
                
              </CardContent>
            </Card>
          </section>

          {/* Footer */}
          <footer className="text-center text-gray-600 py-8 border-t border-red-200">
            <p className="mb-2">Kevin & Estrel Wedding</p>
            <p className="mb-4">April 6, 2025 | Cityville</p>
            <p className="text-sm">
              Made with <Heart className="inline-block h-4 w-4 text-red-800" /> for our special day
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}