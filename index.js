
const express= require('express');
const connection= require('./connection');
const {userRouter}= require('./Routes/user.routes');
const { postRouter } = require('./Routes/post.routes');
const cors= require('cors');

const app= express();

app.use(express.json());
app.use(cors())

app.use('/users', userRouter);
app.use('/posts', postRouter);

app.listen(8080, async()=>{

    try {
        await connection;
        console.log("Connected to DB and server is started");
    } catch (error) {
        console.log(error);
    }
});

