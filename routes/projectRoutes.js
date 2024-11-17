const express = require('express');
const router = express.Router();

const upload = require('../middleware/multer');
const Project = require('../models/projectModel');


const auth = require('../middleware/auth.js')

//Create a new post
router.post("/", auth, async (req, res) => { 
    const newProject = new Project(req.body);
    try {
        const savedProject = await newProject.save();
        res.status(200).json({ msg:'New Poject has been Created',Project: savedProject});
    } catch (err) {
        res.status(500).json(err);
    }
});

// Get all projects for a specific user
router.get('/user/:userId', async (req, res) => {
    try {
        const projects = await Project.find({ userId: req.body.userId });
        res.status(200).json(projects);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all projects
router.get('/usersProjects', async (req, res) => {
    try {
      const projects = await Project.find();
      res.status(200).json(projects);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server error' });
    }
  });
// Get a project by project ID
router.get('/:projectId',auth, async (req, res) => {
    const {projectId}=req.params
    try {
      const project = await Project.findOne({_id:projectId});
      res.status(200).json(project);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Delete a project
  router.delete('/:projectId',auth,async (req, res) => {
  const {projectId}=req.params
  try { 
      const project = await Project.findByIdAndDelete({_id:projectId})
     res.status(200).send({ msg:`project with Id:${projectId} has been deleted`});
        } catch (error) {
          res.status(400).send({ error: error.message });
        }

});

module.exports = router;