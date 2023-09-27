const express = require('express')
var bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')
const { createServer } = require('http');
require('dotenv').config()

const app = express();
const { getIO, initIO } = require('./socket');

const httpServer = createServer(app);
initIO(httpServer);
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

//Routes
const StoryRoute = require('./routes/story')
const MsgsRoute = require('./routes/msgs')
const ChatsRoute = require('./routes/chats')

//Routing
app.use('/story',StoryRoute)
app.use('/msgs',MsgsRoute)
app.use('/chats',ChatsRoute)

app.post("/",(req,res)=>{
    console.log(req.body);
    res.send("Connected successfully")
})

app.get("/getVersion",(req,res)=>{
    var response = {"version":process.env.VERSION}
    res.send(response)
})

const port = process.env.PORT || 8000;
httpServer.listen(port,()=>{
    console.log(`Server started in port ${port}`)
})

getIO();