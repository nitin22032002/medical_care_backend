const mongoose=require("mongoose")

const drugsModel=new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    drugs_name:{
        type:String,
        required:true
    },
    diseases_name:{
        type:String,
        required:true
    },
    
})

module.exports=mongoose.model("drugs",drugsModel);