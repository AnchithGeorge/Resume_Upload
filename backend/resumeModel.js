// backend/resumeModel.js
const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  location: String,
  skills: [String],
  experience: String,
  education: String,
  job_title: String,
  file_path: String,
});

module.exports = mongoose.model('Resume', resumeSchema);
