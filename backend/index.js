import express from "express";
import dotenv from "dotenv";
import dbConnect from "./db/dbConnect.js";
import authRouter from "./routes/User-Auth.routes.js"
import messageRouter from "./routes/message.routes.js"
import userRouter from "./routes/user.routes.js";
import cookieParser from "cookie-parser";
import cors from 'cors';
import {app, server} from './socket/Socket.js';
import path from 'path'

const __dirname = path.resolve();




dotenv.config();

  
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/message', messageRouter);
app.use('/api/v1/user', userRouter);

app.use(express.static(path.join(__dirname,"/frontend/dist")))

app.get("*",(req,res)=>{
    res.sendFile(path.join(__dirname,"frontend","dist","index.html"))
})


const PORT = process.env.PORT

server.listen(PORT, () => {
    dbConnect();
    console.log(`Server is running at Port: ${PORT}`);
})

