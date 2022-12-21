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
io.use((socket,next)=>{
    let keyFrontend = socket.handshake.query.key

    
    if(keyFrontend !== keyDefined){
        console.log("Error al conectar")
        next(new Error("Invalid"));
        console.log("errooor")
    }else{
        next();
    }
});
io.on('connection',(socket)=>{
    socket.emit("status","connected")

    socket.on('message', (message) =>{
        socket.broadcast.emit('message',{
            body: message.body,
            from: message.from
        })
    })

    socket.on('disconnect',()=>{
        console.log('disconnect')
    })
})

server.listen(PORT)
console.log('Server Started on port '+ PORT)