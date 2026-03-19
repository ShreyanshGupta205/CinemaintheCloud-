const mongoose = require("mongoose")

const videoSchema = new mongoose.Schema({

title:{
type:String
},

filename:{
type:String
},

path:{
type:String
},

createdAt:{
type:Date,
default:Date.now
}

})

module.exports = mongoose.model("Video",videoSchema)