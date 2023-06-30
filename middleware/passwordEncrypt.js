const bcrypt=require("bcrypt")

const encryptPassword=(req,res,next)=>{
    try{
        if(req.body.password){
            let salt=bcrypt.genSaltSync();
            req.body.password=bcrypt.hashSync(req.body.password,salt);
        }
        next()
    }
    catch(e){
        console.log(e)
            res.status(500).json({status:false,error:"Server Error....."});
    }
}

const comparePassword=(password,actualPassword)=>{
    try{
        return bcrypt.compareSync(password,actualPassword);
    }
    catch(e){
        return false;
    }
}

module.exports={encryptPassword,comparePassword};