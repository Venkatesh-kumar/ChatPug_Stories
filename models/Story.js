const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StorySchema = new Schema({
    uN:{type: String},
    avatar:{type:String},
    name:{type:String},
    story:{type:String},
    likes:{type:Number}
},{timestamps:true})

const Story = mongoose.model('Story',StorySchema)
module.exports = Story;