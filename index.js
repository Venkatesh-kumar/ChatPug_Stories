const express = require('express')
var bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.use(cors())

//MongoDB credentials
const uri = "mongodb+srv://chatpug:ChatpugAdmin@chatpug0.ae72yqv.mongodb.net/?retryWrites=true&w=majority"
//asynchronous function to connect to mongodb
async function connect(){
    try{
        await mongoose.connect(uri);
        console.log("Connected to db");
    }catch(err){
        console.log(err);
    }
}
//connecting to mongodb
connect();

app.get("/",(req,res)=>{
    res.send("Connected successfully")
})

const port = process.env.PORT || 8000;
app.listen(port,()=>{
    console.log(`Server started in port ${port}`)
})
