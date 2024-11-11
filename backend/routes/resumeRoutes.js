const express = require('express');
const path = require('path');
const multer = require('multer'); // For handling file uploads
const pdfParse = require('pdf-parse'); // Parses PDF content
const Resume = require('../resumeModel'); // Resume model for MongoDB

const router = express.Router();

// Configure multer to save files to 'uploads' folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files to 'uploads' directory
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName); // Unique filename with timestamp
  },
});

const upload = multer({ storage });

// Route to upload a resume and extract data
router.post('/upload', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Parse PDF and extract text
    const pdfData = await pdfParse(req.file.path);
    const extractedText = pdfData.text;

    // Extract specific skills
    const skills = extractSkills(extractedText);
    const name = extractedText.match(/Name:\s*(.*)/i)?.[1] || 'N/A';

    // Save data, file name, and file path to MongoDB
    const newResume = new Resume({
      name: name,
      skills: skills,
      file_name: req.file.filename, // Save the file name in database
      file_path: req.file.path,     // Save the file path in database
    });

    await newResume.save();
    res.json({ message: 'Resume data saved successfully!', data: newResume });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error parsing the PDF file' });
  }
});

// Helper function to identify skills
function extractSkills(text) {
  const skillKeywords = ['JavaScript', 'React', 'Node.js', 'CSS', 'HTML', 'Python', 'Java'];
  return skillKeywords.filter(skill => text.includes(skill));
}

// Route to get all resumes
router.get('/resumes', async (req, res) => {
  try {
    const resumes = await Resume.find(); // Fetch all resume data from MongoDB
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving resumes' });
  }
});
// Search route to filter resumes by multiple skills
router.get('/resumes/search', (req, res) => {
  const query = req.query.query;

  // Log the query for debugging
  console.log('Search query:', query);

  if (!query) {
    // If no query is provided, return all resumes
    return Resume.find()
      .then((resumes) => res.json(resumes))
      .catch((error) => res.status(500).json({ error: 'Error fetching resumes' }));
  }

  // Split the query into individual skills (supports space and comma separation)
  const skills = query.split(/[\s,]+/).map(skill => skill.trim().toLowerCase());

  // Use $and to match all skills in the resumes' skills array
  const skillConditions = skills.map(skill => ({
    skills: { $regex: skill, $options: 'i' }, // Case-insensitive search for each skill
  }));

  // Search resumes where all skills are matched
  Resume.find({ $and: skillConditions })
    .then((resumes) => res.json(resumes))
    .catch((error) => res.status(500).json({ error: 'Error fetching resumes' }));
});

module.exports = router;
