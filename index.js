const express = require('express')
var bodyParser = require('body-parser')
const mongoose = require('mongoose')
var crypto = require('crypto');
var Razorpay = require("razorpay");
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

//Razorpay instance
let instance = new Razorpay({

    // key_id:  process.env.RAZORPAY_KEY_ID,
    // key_secret: process.env.RAZORPAY_KEY_SECRET,
    key_id: 'rzp_live_IJrLJQZGPtCCPR',
    key_secret: 'CQXUVCMAbo245VIQ0qn6XACa'
})
console.log('====================================');
console.log(instance);
console.log('====================================');
//creating order
app.post("/payment/order",(req,res)=>{
params=req.body;
instance.orders.create(params).then((data) => {
        res.send({"sub":data,"status":"success"});
}).catch((error) => {
        res.send({"sub":error,"status":"failed"});
})
});

//verifying transcation
app.post("/payment/verify",(req,res)=>{
body=req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;
var expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
                            .update(body.toString())
                            .digest('hex');
var response = {"status":"failure"}
if(expectedSignature === req.body.razorpay_signature)
response={"status":"success"}
res.send(response);
});

app.get("/getVersion",(req,res)=>{
    var response = {"version":process.env.VERSION}
    res.send(response)
})

const port = process.env.PORT || 8000;
httpServer.listen(port,()=>{
    console.log(`Server started in port ${port}`)
})

getIO();