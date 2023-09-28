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
        story:req.body.story,
        location:{
            coordinates:[parseFloat(req.body.longitude),parseFloat(req.body.latitude)]
        },
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

    Story.find({
        location: {
            $near: {
                $geometry: {
                    type: "Point" ,
                    coordinates: [parseFloat(req.body.longitude),parseFloat(req.body.latitude)]
                },
                $minDistance: 0,
                $maxDistance: 100 * 1000, //Converting KMS to Meters
            }
        },
        "createdAt":{$gt:new Date(Date.now() - 12*60*60 * 1000)}
    },{uN:1,story:1},{limit:20})
    .then(response =>{
        res.json({response})
    })
    .catch(err =>{
        res.json({status:'failed'})
        console.log(err);
    })
}

module.exports = {
    index, addStory, getUserStories
}