// backend/server.js
const express = require('express');
const cors = require('cors');  // Import CORS
const connectDB = require('./db');
const resumeRoutes = require('./routes/resumeRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const path = require("path")
// Connect to MongoDB
connectDB();


// Middleware
app.use(cors());  // Enable CORS for all routes
app.use(express.json());
// Serve static files from the 'uploads' directory
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.get('/uploads/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.params.filename);
  res.download(filePath, req.params.filename, (err) => {
    if (err) {
      res.status(500).send({ error: 'File download error' });
    }
  });
});



app.use('/api', resumeRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
