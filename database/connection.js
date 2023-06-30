const mongoose=require("mongoose")

const connectDb=()=>{
    mongoose.connect(process.env.CONNECTION_STRING)
}

module.exports=connectDb