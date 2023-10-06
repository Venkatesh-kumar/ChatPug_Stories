const { Server } = require("socket.io");
const { v4: uuidv4 } = require("uuid");
let IO;

module.exports.initIO = (httpServer) => {
  IO = new Server(httpServer);

  IO.use((socket, next) => {
    if (socket.handshake.query) {
      let callerId = socket.handshake.query.callerId;
      socket.user = callerId;
      next();
    }
  });

  var maleUsers = []
    var femaleUsers = []

    var mR0 = []
    var fR0 = []
    var oR0 = []

  IO.on("connection", (socket) => {
    console.log(socket.user, "Connected");
    socket.join(socket.user);

    let roomID
    let roomIndex
    let gender

    socket.on('join-room',(peerID,user,coun,interest)=>{
        let pID = peerID
        let room
        gender = user
        if(user == 'male')
        {
          let maleUser
          if(fR0.length === 0)
          {
            roomID = uuidv4()
            socket.join(roomID)
            room = {"rID" :roomID, coun: coun}
            mR0.push(room)
            maleUser= {soc:socket.id, "room":roomID, pID:peerID, coun: coun}
          }
          else
          {
            roomIndex = fR0.findIndex(r => r.coun === interest)
            if(roomIndex !== -1)
            {
              roomID = fR0.splice(roomIndex,1)
              roomID = roomID[0].rID
            }
            else
            {
              roomID = uuidv4()
            }
            socket.join(roomID)
            room = {"rID" :roomID,coun:coun}
            if(roomIndex !== -1){oR0.push(room)}
            else{mR0.push(room)}
            maleUser= {soc:socket.id, "room":roomID, pID:peerID, coun: coun}
            IO.to(roomID).emit('createMessage', `---Stranger joined the chat---`);
          }
          maleUsers.push(maleUser)
        }
        else
        {
          let femaleUser
          if(mR0.length === 0)
          {
            roomID = uuidv4()
            socket.join(roomID)
            room = {"rID" :roomID,coun:coun}
            fR0.push(room)
            femaleUser= {soc:socket.id, "room":roomID, pID:peerID, coun: coun}
          }
          else
          {
            roomIndex = mR0.findIndex(r => r.coun === interest)
            if(roomIndex !== -1)
            {
              roomID = mR0.splice(roomIndex,1)
              roomID = roomID[0].rID
            }
            else
            {
              roomID = uuidv4()
            }
            socket.join(roomID)
            room = {"rID" :roomID,coun:coun}
            if(roomIndex !== -1){oR0.push(room)}
            else{fR0.push(room)}
            
            femaleUser= {soc:socket.id, "room":roomID, pID:peerID, coun: coun}
            IO.to(roomID).emit('createMessage', `---Stranger joined the chat---`);
          }
          femaleUsers.push(femaleUser)
        }
        console.log("mU:", maleUsers, "fU:", femaleUsers, "mR:", mR0,"fR:", fR0,"oR:", oR0);
        
          setTimeout(()=>{
            let activeUsers = maleUsers.length + femaleUsers.length
            console.log(activeUsers)
            socket.to(roomID).emit("user-connected", pID);
            socket.to(roomID).emit("activeUsers",activeUsers);
          }, 1000)
      })

    socket.on("call", (data) => {
      let calleeId = data.calleeId;
      let rtcMessage = data.rtcMessage;

      socket.to(calleeId).emit("newCall", {
        callerId: socket.user,
        rtcMessage: rtcMessage,
      });
    });

    socket.on("answerCall", (data) => {
      let callerId = data.callerId;
      rtcMessage = data.rtcMessage;

      socket.to(callerId).emit("callAnswered", {
        callee: socket.user,
        rtcMessage: rtcMessage,
      });
    });

    socket.on("ICEcandidate", (data) => {
      console.log("ICEcandidate data.calleeId", data.calleeId);
      let calleeId = data.calleeId;
      let rtcMessage = data.rtcMessage;

      socket.to(calleeId).emit("ICEcandidate", {
        sender: socket.user,
        rtcMessage: rtcMessage,
      });
    });

    socket.on("message", (message) => {
    IO.to(roomID).emit("createMessage", message, 'Stranger');
      });

    socket.on('PhotoRequest',(otherUserId)=>{
        socket.to(otherUserId).emit('PhotoRequest')
    })

    socket.on('AcceptPhoto',(otherUserId)=>{
        socket.to(otherUserId).emit('AcceptPhoto')
    })

    socket.on('disconnect', () => {
      
      let uI, uR, uC
      let room;
      if(maleUsers.findIndex(a => a.pID === socket.user) !== -1)
      {gender = 'male'}
      else if(femaleUsers.findIndex(a => a.pID === socket.user) !== -1)
      {gender = 'female'}
      else
      {gender = ''}
     
      if(gender == 'male')
      {
        uI = maleUsers.findIndex(a => a.pID === socket.user)
        uR = maleUsers[uI].room;
        uC = maleUsers[uI].coun
        // Check if user is in occupied room or single room
        if(oR0.findIndex(r => r.rID == uR) !== -1)
        {
          socket.to(uR).emit("createMessage", `---Stranger left the chat---`);
          room = {"rID": uR, "coun": uC}
          fR0.push(room)
          oR0.splice(oR0.findIndex(r=> r.rID === uR) , 1)
        }
        else
        {
          mR0.splice(mR0.findIndex(r=> r.rID === uR) , 1)
        }
        maleUsers.splice(maleUsers.findIndex(a => a.pID === socket.user) , 1)
        socket.to(uR).emit("lost")
      }
      else if(gender === 'female')
      {
        uI = femaleUsers.findIndex(a => a.pID === socket.user)
        uR = femaleUsers[uI].room;
        uC = femaleUsers[uI].coun
        if(oR0.findIndex(r => r.rID == uR) !== -1)
        {
          socket.to(uR).emit("createMessage", `---Stranger left the chat---`);
          room = {"rID": uR, "coun": uC}
          mR0.push(room);
          oR0.splice(oR0.findIndex(r=> r.rID === uR) , 1)
        }
        else
        {
          fR0.splice(fR0.findIndex(r=> r.rID === uR) , 1)
        }
        femaleUsers.splice(femaleUsers.findIndex(a => a.pID === socket.user) , 1)
        socket.to(uR).emit("lost")
      }
      console.log("mU:", maleUsers, "fU:", femaleUsers, "mR:", mR0,"fR:", fR0,"oR:", oR0);
      
    });

  });
};

module.exports.getIO = () => {
  if (!IO) {
    throw Error("IO not initilized.");
  } else {
    return IO;
  }
};
