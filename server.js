const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

const storage = multer.diskStorage({
  destination: "uploads/", // Ensure this folder exists
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });


const mongoURI = process.env.MONGODB_URI; // Use the exact key from .env
if (!mongoURI) {
    console.error("❌ MONGO_URI is not defined! Check your .env file.");
    process.exit(1);
}

mongoose
    .connect(mongoURI, { dbName: "weddingplan", useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));

    
const MemorySchema = new mongoose.Schema({
  name: String,
  images: [String], // Store image URLs if using cloud storage (e.g., Cloudinary)
  message: String,
  createdAt: { type: Date, default: Date.now },
});
const Memory = mongoose.model("Memory", MemorySchema);

app.get("/upload", async (req, res) => {
  try {
    const memories = await Memory.find();
    res.json(memories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching uploads" });
  }
});

app.post("/upload", upload.array("images", 10), async (req, res) => {
  try {
    const { name, message } = req.body;
    const images = req.files.map((file) => file.path); // Save correct file path

    const newMemory = new Memory({ name, images, message });
    await newMemory.save();

    res.status(201).json({ message: "Memory uploaded successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Upload failed.", error });
  }
});


// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
