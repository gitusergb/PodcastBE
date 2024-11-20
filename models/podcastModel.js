const mongoose = require('mongoose');

// Define a validation function for file URLs to ensure proper type
const fileUrlValidator = (url) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    const fileRegex = /\.(mp4)$/i;
    return youtubeRegex.test(url) || fileRegex.test(url);
};


const PodcastSchema = new mongoose.Schema({
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    title: { type: String, required: true },
    transcript:{type: String},
    description:{type: String},
    fileUrl: { 
        type: String, 
        required: true, 
        validate: {
            validator: fileUrlValidator,
            message: 'fileUrl must be a valid YouTube link or an MP4 file URL.'
        } 
    },
    uploadedFiles: [{ 
        fileName: { type: String },
        fileUrl: { type: String },
    }],
    status: { 
        type: String, 
        enum: ['pending', 'completed', 'failed'], 
        default: 'pending' 
    },
    createdAt: { type: Date.toLocaleString("en-IN",{}), default: Date.now },
    updatedAt: { type: Date.toLocaleString("en-IN",{}), default: Date.now }
});


// Middleware to auto-update the `updatedAt` field on document updates
PodcastSchema.pre('save', function(next) {
this.updatedAt = Date.now();
next();
});

const Podcast = mongoose.model('Podcast', PodcastSchema);
module.exports =Podcast

   



