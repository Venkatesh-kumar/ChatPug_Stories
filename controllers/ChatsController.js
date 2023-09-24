const admin = require("../firebase-config")
const Msgs = require('../models/Msgs')

const chatsCollRef = admin.firestore().collection("chats")



const addChat = async(req,res,next) =>{
    const chatid= req.body.chatid
    const uN= req.body.from
    const Message = req.body.Message
    const fcm= req.body.fcm
    const to =  req.body.to
    let addMsgNot = false

    let resp = await chatsCollRef.doc(chatid).collection('messages').add({
        from:uN,
        message:Message,
        sentAt:Date.now(),
        read:false,
        to: to
    })
    .then((respo)=>{
        res.json({status: 'success'})
       
        setTimeout(async() => {
            let doc = await chatsCollRef.doc(chatid).collection('messages').doc(respo.id).get()
            if(doc.exists)
            {
                let document = doc.data()
                if(!document.read)
                {   
                    addMsgNot = true;
                    var payload = {
                        notification: {
                        title: "New Message",
                        body: `${uN} sent you a new message.`,
                        sound:'default',
                        }
                    };
            
                    var options = {
                        priority: "high",
                        timeToLive: 60 * 60 *24,
                    };

                    admin.messaging().sendToDevice(fcm,payload,options)
                    .then((response) => {
                       console.log("Notification sent");
                    })
                    .catch((error) => {
                        console.log('Error sending message:', error);
                    });

                    let Msg = new Msgs({
                        from:uN,
                        to:to,
                        msg:'Msg'
                     })
                     Msg.save()

                }
            }
        }, 2000);
    })
    .catch(err=>{
        console.log("Failed writing in document");
    })

    // if(addMsgNot)
    // {
    //     let Msg = new Msgs({
    //         from:uN,
    //         to:to,
    //      })
    //      Msg.save()
    //      .then(response => {
    //         console.log("Notification added");
    //          res.json({status: 'success'})
    //      })
    //      .catch(err => {
    //          console.log(err)
    //          res.json({status: 'failure'})
    //      })
    // }
}

module.exports = {addChat}