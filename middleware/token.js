const jwt=require("jsonwebtoken");
const userModel=require("../database/userModel")
const generateToken=(data)=>{
    try{
        let token=jwt.sign(data,process.env.JWT_STRING)
        return token;
    }
    catch(e){
        return  null;
    }
}

const verifyToken=async(req,res,next)=>{
    try{
        let token=req.headers.auth_token;
        if(!token){
            throw("Invalid User.....")
        }
        let data=jwt.decode(token);
        if(!data){
            throw("Invalid User.....")
        }
        let user=await userModel.findById(data.id);
        if(user.token!=token){
            return res.status(400).json({status:false,error:"Session Expire...."});
        }
        if(user.isGmail){
            data=jwt.decode(data.token);
            if(!data){
                throw("Invalid User....")
            }
        }
        req['body']['user_id']=user._id;
        next()
    }
    catch(e){
        return res.status(401).json({status:false,error:"Invalid User...."});
    }
}

module.exports={generateToken,verifyToken};