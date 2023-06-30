const express=require("express")
const dotenv=require("dotenv")
const app=express()
const cors=require("cors")
dotenv.config({path:"./.env"})
require("./database/connection")()

app.use(cors())

app.use(express.json())

PORT=process.env.PORT || 5000

app.use("/",require("./routers/user"))

app.use("/",require("./routers/diseases"))

app.get("/*",(req,res,next)=>{
    res.status(404).json({"status":false,"error":"Invalid Url Access...."})
})

app.listen(PORT,()=>{
    console.log("Server At PORT "+PORT)
})