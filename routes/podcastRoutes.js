const express = require('express');
const router = express.Router();

const Podcast = require('../models/podcastModel');
const Project = require('../models/projectModel');
const auth = require('../middleware/auth');
const upload = require('../middleware/multer');

router.get('/:projectId', auth, async (req, res) => {
    try {
        const podcasts = await Podcast.find({ projectId: req.params.projectId });
        res.status(200).json({ msg:'all podcasts',podcasts:podcasts});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.post('/:projectId', upload.single('file'), async (req, res) => {
    try {
        console.log('Received projectId:', req.params.projectId);
        
        const project = await Project.findById(req.params.projectId);
        
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        console.log('Found project:', project);

        const {title,transcript,description } = req.body;
        const fileUrl = req.file?req.file.path : req.body.fileUrl; 
        console.log('Creating new podcast with data:', 
        {  projectid: project._id,title,transcript, description, fileUrl });

        const newPodcast = new Podcast({
            projectId: project._id,
            title,
            transcript,
            description,
            fileUrl
        });

        const savedPodcast = await newPodcast.save();
        console.log('Saved podcast:', savedPodcast);

        // Update project
        project.episodeCount = (project.episodeCount || 0) + 1;
        project.updatedAt = Date.now();
        await project.save();

        res.status(201).json({
            message: 'Podcast added successfully',
            podcast: savedPodcast
        });
    } catch (err) {
        console.error('Error adding podcast:', err);
        res.status(500).json({ message: 'Error adding podcast', error: err.message });
    }
});


 // Delete a Podcast
 router.delete('/:podcastId',auth,async (req, res) => {
    const {podcastId}=req.params
    try { 
        const podcast = await Podcast.findByIdAndDelete({_id:podcastId})
       res.status(200).send({ msg:`Podcast with Id:${podcastId} has been deleted`});
          } catch (error) {
            res.status(400).send({ error: error.message });
          }
  
  });

module.exports = router;