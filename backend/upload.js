const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure 'uploads' directory exists
const uploadDir = path.join(__dirname, '../upload'); // Go up one directory for uploads
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
// const storage = multer.diskStorage({
//   destination: uploadDir,
//   filename: (req, file, cb) => {
//     const timestamp = Date.now();
//     const uniqueFilename = `${timestamp}-${file.originalname}`;
//     cb(null, uniqueFilename);
//   }
// });

// app.post('/upload', upload.single('resume'), async (req, res) => {
//     try {
//       if (!req.file) {
//         return res.status(400).json({ error: 'No file uploaded' });
//       }
  
//       // Parse the PDF file
//       const pdfData = await pdfParse(req.file.buffer);
//       const extractedText = pdfData.text;
  
//       // Extract specific skills (example)
//       const skills = extractSkills(extractedText);
  
//       res.json({
//         text: extractedText,
//         skills: skills,
//       });
//     } catch (error) {
//       res.status(500).json({ error: 'Error parsing the PDF file' });
//     }
//   });
  
  // Helper function to extract skills (customize this with your skill list)
  function extractSkills(text) {
    const skillKeywords = ['JavaScript', 'React', 'Node.js', 'CSS', 'HTML', 'Python', 'Java']; // Add your skill list here
    const skills = skillKeywords.filter((skill) => text.includes(skill));
    return skills;
  }
  

// File type validation
// const fileFilter = (req, file, cb) => {
//   const allowedFileTypes = /jpeg|jpg|png|pdf/; // Add more as needed
//   const mimeType = allowedFileTypes.test(file.mimetype);
//   const extName = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());

//   if (mimeType && extName) {
//     cb(null, true);
//   } else {
//     cb(new Error('Invalid file type. Only JPEG, PNG, and PDF files are allowed.'));
//   }
// };

// Upload instance with file size limit and file filter
const upload = multer({
    storage: multer.memoryStorage(), // store files in memory for quick parsing
    fileFilter: (req, file, cb) => {
      if (path.extname(file.originalname) === '.pdf') {
        cb(null, true);
      } else {
        cb(new Error('Only PDF files are allowed'));
      }
    },
  });

module.exports = upload;
