const express = require("express");
const app = express();
const port = 3000; // Change this to the desired port number

const jwt = require("jsonwebtoken");
const secretKey = "your-secret-key"; // Change this to a secure secret key for JWT

const artworks = require("./artworks.json"); // Load sample artworks data from a JSON file

app.use(express.json());

// Middleware for user authentication using JWT
function authenticateToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }

    req.user = user;
    next();
  });
}

// Endpoint to authenticate user and get a JWT token
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  // In a real-world scenario, verify the credentials against a database
  if (username === "user" && password === "password") {
    const token = jwt.sign({ username }, secretKey, { expiresIn: "1h" });
    res.json({ token });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

// Endpoint to get all artworks
app.get("/api/artworks", (req, res) => {
  res.json(artworks);
});

// Endpoint to add a new artwork (requires authentication)
app.post("/api/artworks", authenticateToken, (req, res) => {
  const { title, category, thumbnail, fullImage } = req.body;

  // In a real-world scenario, store the artwork in a database
  artworks.push({ title, category, thumbnail, fullImage });

  res.json({ message: "Artwork added successfully" });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

// Endpoint to upload artwork image (requires authentication)
app.post("/api/upload", authenticateToken, upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  // In a real-world scenario, store the artwork image in a proper file storage system or database
  const thumbnail = req.file.filename;
  const fullImage = req.file.filename;

  const { title, category } = req.body;
  artworks.push({ title, category, thumbnail, fullImage });

  res.json({ message: "Artwork added successfully" });
});