const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    episodeCount: { type: Number, default: 0 },
    userId:{ type:String,ref:'User'},
    username:{type:String,ref:'User'},
    email:{type:String,ref: 'User'},
    podcast: [{ type:String , ref: 'Podcast' }],
    video:[{type:String,ref:'videos'}],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
},{
    versionKey:false
  });

const Project = mongoose.model('Project', ProjectSchema);
module.exports =Project