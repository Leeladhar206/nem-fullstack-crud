
const express= require('express');
const { PostModel } = require('../model/post.model');
const { authMiddleware } = require('../middleware/auth.middleware');

const postRouter= express.Router();

postRouter.get('/', authMiddleware, async(req,res)=>{
    try {     
        const allposts= await PostModel.find({userId:req.body.userId});
        return res.status(200).send(allposts)

    }catch(error) {
        return res.send({"error":error.message})
    }
});


postRouter.post('/add', authMiddleware, async(req,res)=>{
    try {     
        
        const newPost= new PostModel(req.body);
        await newPost.save();
        return res.status(200).send({"post":newPost})

    }catch(error) {
        return res.send({"error":error.message})
    }
});

postRouter.patch('/update/:noteId', authMiddleware, async(req,res)=>{

    const {noteId}= req.params;
    // console.log(noteId)
     
    try {     
        const updateNote= await PostModel.findOne({_id:noteId});
        console.log(updateNote,req.body)

        if(req.body.userId==updateNote.userId){

            await PostModel.findByIdAndUpdate({_id:noteId},req.body);
            return res.status(200).send({"msg":"Post is updated"})
        }else{
            res.status(200).send({"msg":"You are not authorised"})
        }

    }catch(error) {
        return res.send({"error":error.message})
    }
});

postRouter.delete('/delete/:noteId', authMiddleware, async(req,res)=>{

    const {noteId}= req.params;
     
    try {     
        const deleteNote= await PostModel.findOne({_id:noteId});

        if(req.body.userId==deleteNote.userId){

            await PostModel.findByIdAndDelete({_id:noteId});
            return res.status(200).send({"msg":"Post is deleted"})
        }else{
            res.status(200).send({"msg":"You are not authorised"})
        }

    }catch(error) {
        return res.send({"error":error.message})
    }
});

module.exports= {postRouter};
