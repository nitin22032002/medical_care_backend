const mongoose=require("mongoose")

const diseasesModel=new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    diseases_name:{
        type:String,
        required:true
    },
    symptoms:{
        type:String,
    },
    cvc_report:{
        type:String,
    },
    specific_dignosis_report:{
        type:String
    },
    add_date:{
        type:Date,
        default:Date.now
    },
    discription:{
        type:String,
    }
})

module.exports=mongoose.model("diseases",diseasesModel);