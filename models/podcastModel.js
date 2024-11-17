const mongoose = require('mongoose');

const PodcastSchema = new mongoose.Schema({
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    title: { type: String, required: true },
    transcript:{type: String},
    description:{type: String},
    fileUrl: { type: String, required:true },
    uploadedFiles: [{ 
        fileName: { type: String },
        fileUrl: { type: String },
    }],
    status:{ type: String, required: false},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Podcast = mongoose.model('Podcast', PodcastSchema);
module.exports =Podcast

