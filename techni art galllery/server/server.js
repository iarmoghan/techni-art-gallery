const express = require("express");
const app = express();
const port = 3000;

const jwt = require("jsonwebtoken");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const secretKey = "your-secret-key";

const artworks = require("./server/artworks.json");

app.use(express.json());

// Middleware for user authentication using JWT
function authenticateToken(req, res, next) {
  // ... (same as before)
}

// Endpoint to authenticate user and get a JWT token
app.post("/api/login", (req, res) => {
  // ... (same as before)
});

// Endpoint to get all artworks
app.get("/api/artworks", (req, res) => {
  res.json(artworks);
});

// Endpoint to add a new artwork (requires authentication)
app.post("/api/upload", authenticateToken, upload.single("file"), (req, res) => {
  // ... (same as before)
});

// Serve the frontend files from the 'public' folder
app.use(express.static("public"));

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});