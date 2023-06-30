const express=require("express");
const router=express.Router();
const userModel=require("../database/userModel")
const {encryptPassword,comparePassword}=require("../middleware/passwordEncrypt")
const {generateToken,verifyToken}=require("../middleware/token")
const jwt=require("jsonwebtoken");

const addUser=async(req,res,next)=>{
    try{
        let {name,email,password}=req.body;
        email=String(email).toLowerCase()
        let user=await userModel.findOne({emailid:email});
        if(user){
            return  res.status(400).json({status:false,error:"Email Id Already Exist..."});
        }
        user=await userModel.create({name:name,emailid:email,password:password,token:""});
        let token=generateToken({id:user._id});
        user.token=token;
        await user.save();
        return res.status(200).json({status:true,token});
    }
    catch(e){
        console.log(e)
        return res.status(500).json({status:false,error:"Server Error....."});
    }
}

const login=async(req,res,next)=>{
    try{
        let user_token;
        let {gmail,token,password,email}=req.body;
        
        if(gmail){
            let data=jwt.decode(token);
            let {name,email}=data;
            let user=await userModel.findOne({emailid:email});
            if(!user){
                user=await userModel.create({name,emailid:email,isGmail:true,token:""});
            }
            user_token=generateToken({id:user._id,token});
            user.token=user_token;
            await user.save();
        }
        else{
            email=String(email).toLowerCase()
            let user=await userModel.findOne({emailid:email});
            if(!user || !comparePassword(password,user.password)){
                // console.log("DDDDD")
                return res.status(400).json({status:false,error:"Invalid EmailId or Password"});
            }
            user_token=generateToken({"id":user._id});
            await user.save();
        }
        // console.log("AJSJKA")
        return res.status(200).json({status:true,token:user_token});
    }
    catch(e){
        console.log(e);
        return res.status(500).json({status:false,error:"Server Error....."});
    }
}


const logout=async(req,res,next)=>{
    try{
        let {user_id}=req.body;
        let user=await userModel.findById(user_id);
        user.token="";
        await user.save();
        return res.status(200).json({status:true});
    }
    catch(e){
        return res.status(500).json({status:false,error:"Server Error....."});   
    }
}

const getUser=async(req,res,next)=>{
    try{
        let {user_id}=req.body;
        let user=await userModel.findById(user_id);
        return res.status(200).json({status:true,data:[user]});
    }
    catch(e){
        return res.status(500).json({status:false,error:"Server Error....."});   
    }
}


router.post("/signup",encryptPassword,addUser);

router.post("/login",login);

router.delete("/logout",verifyToken,logout);

router.get("/",verifyToken,getUser);

module.exports=router;