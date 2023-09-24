const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MsgsSchema = new Schema({
    from:{type: String},
    to:{type:String},
    msg:{type:String} //Like, Accept, Request, Msg
},{timestamps:true})

const Msgs = mongoose.model('Msgs',MsgsSchema)
module.exports = Msgs;