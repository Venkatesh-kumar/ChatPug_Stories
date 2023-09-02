const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pointSchema = new Schema({
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: "Point"
    },
    coordinates: {
      type: [Number],
      required: true
    }
  });

const StorySchema = new Schema({
    uN:{type: String},
    avatar:{type:String},
    name:{type:String},
    story:{type:String},
    location: {
        type: pointSchema,
      },
},{timestamps:true})

StorySchema.index({location:"2dsphere"})

const Story = mongoose.model('Story',StorySchema)
module.exports = Story;