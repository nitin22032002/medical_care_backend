const mongoose=require("mongoose")

const userModel=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    emailid:{
        type:String,
        required:true
    },
    password:{
        type:String,
    },
    isGmail:{
        type:Boolean,
        default:false,
    },
    login_date:{
        type:Date,
        default:Date.now
    },
    token:{
        type:String,
    }
})

module.exports=mongoose.model("users",userModel);