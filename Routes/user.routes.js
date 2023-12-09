const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../model/user.model");
const { BlackListModel } = require("../model/blacklist.model");

require("dotenv").config();

const userRouter = express.Router();

userRouter.post("/register", async (req, res) => {
  const { email, pass } = req.body;

  try {
    const existingEmail = await UserModel.findOne({ email });

    if (existingEmail) {
      return res.status(200).send({ msg: "user already existed" });
    }

    bcrypt.hash(pass, 6, async (err, hash) => {
      if (err) {
        res.status(200).send({ error: err.message });
      } else {
        req.body.pass = hash;

        const newUser = new UserModel(req.body);
        await newUser.save();

        console.log(newUser);
        res.status(200).send({
            msg: "The new user has been registered",
            registeredUser: newUser,
          });
      }
    });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});


userRouter.post("/login", async (req, res) => {
  try {
    const { email, pass } = req.body;

    const dbuser = await UserModel.findOne({ email });

    if (dbuser) {
      bcrypt.compare(pass, dbuser.pass, (err, decoded) => {
        console.log(err, dbuser);
        if (!decoded) {
          return res.status(400).send({ error: err });
        }

   
        const token = jwt.sign({ userId: dbuser._id }, process.env.key, {
            expiresIn: "1h",
        });
        
        if(token){
            return res.status(200).send({ msg: "Login successful!", token});
        }
      });
    } else {
      return res.status(200).send({ msg: "Please register first!!" });
    }
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
});

userRouter.get('/logout', async(req,res)=>{
    try {
        const token= req.headers.authorization?.split(' ')[1] || null;
        
        if(token){
            const ans= await BlackListModel.updateOne({},{ $addToSet: { blackList: token } },
            { upsert: true } );
            res.status(200).send({"msg":ans})
        }
        
    } catch (error) {
        res.status(400).send({"error":error.message, "ans":"hi"}); 
    }
});

module.exports = { userRouter };
