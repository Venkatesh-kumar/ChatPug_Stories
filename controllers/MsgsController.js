const { ObjectId } = require('mongodb');
const Msgs = require('../models/Msgs')

//Return complete list of Msg Notifications
const index = (req,res,next)=>{
    Msgs.find()
    .then(response => {
        res.json({response})
    })
    .catch(err => {
        res.json({message:'An error occured'})
    })
}

//Add a message notification
const addMsg = (req,res,next) => {
    let Msg = new Msgs({
       from:req.body.from,
       to:req.body.to,
       msg:req.body.msg
    })
    Msg.save()
    .then(response => {
        res.json({status: 'success'})
    })
    .catch(err => {
        console.log(err)
        res.json({status: 'failure'})
    })
}

//Return user Msgs
const getUserMsgs = (req,res,next)=>{
    let user = req.body.to
    Msgs.find({
        to:user,
    })
    .then(response =>{
        res.json({response})
    })
    .catch(err =>{
        res.json({status:'failed'})
    })
}

//Delete a Msg
const deleteMsg = (req,res,next)=>{
    let to = req.body.to
    Msgs.deleteMany({
        to:to
    })
    .then(response => {
        res.json({status: 'success'})
    })
    .catch(err => {
        res.json({status: 'failure'})
    })
}

//Delete a Msg
const deleteMsgType = (req,res,next)=>{
    let to = req.body.to
    let type = req.body.type
    Msgs.deleteMany({
        to:to,
        msg:type
    })
    .then(response => {
        res.json({status: 'success'})
    })
    .catch(err => {
        res.json({status: 'failure'})
    })
}


module.exports = {
    index, addMsg, getUserMsgs, deleteMsg, deleteMsgType
}