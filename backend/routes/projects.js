const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// 🔥 NO MODEL FILE NEEDED - Direct bana diya!
const ProjectSchema = new mongoose.Schema({
  projectName: String,
  media: Array,
  clips: Array,
  resolution: String,
  fps: Number,
  zoomLevel: Number
});

const Project = mongoose.model('Project', ProjectSchema);

router.get('/', async (req, res) => {
  const projects = await Project.find();
  res.json(projects);
});

router.post('/', async (req, res) => {
  const project = new Project(req.body);
  await project.save();
  res.json(project);
});

module.exports = router;
