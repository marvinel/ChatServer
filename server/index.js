import express from "express";
import morgan from "morgan";
import { Server as SocketServer} from "socket.io";
import http from 'http'
import cors from 'cors'

import {PORT} from './config.js'

const app = express();
const server = http.createServer(app)
const io = new SocketServer(server,{
    cors: {
        origin: 'http://localhost:3000'
    }    
})
 
app.use(cors())
app.use(morgan("dev"))

const keyDefined = "asdasfa9wa90"
let Names = new Map();
io.use((socket,next)=>{
    let keyFrontend = socket.handshake.query.key

    
    if(keyFrontend !== keyDefined){
        console.log("Error al conectar")
        next(new Error("Invalid"));
       
    }else{
        next();
    }
});
io.on('connection',(socket)=>{
    socket.emit("status","connected")

    socket.on('message', (message) =>{

        socket.to(message.room).emit('message',({
            body: message.body,
            from: Names.get(socket.id)
        }));
    })

    socket.on("joined",(data)=>{
        //socket.broadcast.emit('joined', data)
        if(!Names.has(socket.id)){
            Names.set(socket.id, data);
        }
       
       
    })

    socket.on("createroom",(data)=>{      
       
        socket.join(data);     
    })

    socket.on("joinroom",(data)=>{
        socket.join(data);
       
       
    })
    socket.on('disconnect',(data)=>{
       // console.log('disconnect')
    })
})

server.listen(PORT)
console.log('Server Started on port '+ PORT)