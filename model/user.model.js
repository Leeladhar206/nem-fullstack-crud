const mongoose= require('mongoose');

const userSchema= mongoose.Schema(
    {
        username:String,
        email:{type:String,required:true},
        pass:{type:String,required:true},
    },{
        versionKey:false
    }
);


const UserModel= mongoose.model('user',userSchema);

module.exports= {UserModel};