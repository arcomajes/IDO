const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require('fs');
require('v8').setFlagsFromString('--max-old-space-size=4096');
require("dotenv").config();

if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
  console.log('Created uploads directory');
}

const app = express();
// Allow CORS for frontend domain
app.use(cors({
  origin: ["https://wedding-plan-beta.vercel.app", "http://localhost:3000"], // Your frontend domain
  //origin: "*",
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
  credentials: true
}));


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('trust proxy', 1);




// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Serve static files from the 'public' directory (images, favicon, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Serve frontend build only in production
if (process.env.NODE_ENV === 'production') {
  // Serve the static assets (e.g., JS, CSS files) from the React app build folder
  app.use(express.static(path.join(__dirname, 'client', 'build')));

  // Handle all other routes and send the React 'index.html' for client-side routing
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  });
} else {
  // For non-production (development), React app will be served by its own server (e.g., webpack dev server)
  // Just serve static files from 'public'
  app.use(express.static(path.join(__dirname, 'public')));
}

// Upload route
app.post("/upload", upload.array("images", 10), async (req, res) => {
  try {
    const images = req.files.map(file => `/uploads/${file.filename}`);
    const newMemory = new Memory({
      name: req.body.name || "Anonymous",
      images,
      message: req.body.message || ""
    });
    await newMemory.save();
    res.status(201).json({ message: "Memory saved!" });
    console.log("Upload route hit!");
  } catch (error) {
    res.status(500).json({ message: "Upload failed" });
  }
});

// Database Connection
mongoose.connect(process.env.MONGODB_URI, { 
  dbName: "weddingplan",
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB Connection Error:", err));


// Models
const MemorySchema = new mongoose.Schema({
  name: String,
  images: [String],
  message: String,
  createdAt: { type: Date, default: Date.now }
});
const Memory = mongoose.model("Memory", MemorySchema);

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
const User = mongoose.model("User", UserSchema);

// Create default admin
const createDefaultUser = async () => {
  try {
    const existingUser = await User.findOne({ username: "Estrell&Kevin" });
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash("Kevstrell0613", 10);
      await User.create({
        username: "Estrell&Kevin",
        password: hashedPassword
      });
      console.log("✅ Default admin created");
    }
  } catch (error) {
    console.error("❌ Error creating admin:", error);
  }
};
createDefaultUser();

// Auth Middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};



// Routes
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { 
      expiresIn: "1h" 
    });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Protected Routes
app.get("/api/memories", authMiddleware, async (req, res) => {
  try {
    const memories = await Memory.find();
    res.json(memories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching memories" });
  }
});

// Add error handling middleware
app.use((err, req, res, next) => {
  console.error("💥 Server Error:", err);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 5001;
console.log(`Configured port: ${PORT}`);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));