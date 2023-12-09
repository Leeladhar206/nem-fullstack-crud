const mongoose= require('mongoose');

const postSchema= mongoose.Schema(
    {
        title:{type:String, required:true},
        userId:{type:String,required:true},
        content:String
    }
);

const PostModel= mongoose.model('post',postSchema);

module.exports= {PostModel};