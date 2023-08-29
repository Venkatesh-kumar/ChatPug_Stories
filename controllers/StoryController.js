const { ObjectId } = require('mongodb');
const Story = require('../models/Story')

//Return complete list of Stories
const index = (req,res,next)=>{
    Story.find({"createdAt":{$gt:new Date(Date.now() - 12*60*60 * 1000)}})
    .then(response => {
        res.json({response})
    })
    .catch(err => {
        res.json({message:'An error occured'})
    })
}

//Add a story to database
const addStory = (req,res,next) => {
    let story = new Story({
        uN: req.body.uN,
        avatar:req.body.avatar,
        name:req.body.name,
        story:req.body.story,
        likes:req.body.likes,
        to:req.body.to
    })
    story.save()
    .then(response => {
        res.json({status: 'success'})
    })
    .catch(err => {
        console.log(err)
        res.json({status: 'failure'})
    })
}

//Return user stories
const getUserStories = (req,res,nexy)=>{
    let user = req.body.user
    Story.find({
        to:user,
        "createdAt":{$gt:new Date(Date.now() - 12*60*60 * 1000)}
    },{uN:1,avatar:1,name:1,story:1,likes:1})
    .then(response =>{
        res.json({response})
    })
    .catch(err =>{
        res.json({status:'failed'})
    })
}

module.exports = {
    index, addStory, getUserStories
}