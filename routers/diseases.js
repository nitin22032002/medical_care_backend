const express=require("express");
const router=express.Router();
const diseasesModel=require("../database/diseasesModel")
const drugsModel=require("../database/drugsModel")
const {verifyToken}=require("../middleware/token")

const addDiseases=async(req,res,next)=>{
    try{
        let {diseases_name,symptoms,cvc_report,specific_dignosis_report,drugs,discription,user_id}=req.body;
        let diseases=await diseasesModel.findOne({diseases_name,user_id});
        if(diseases){
            return  res.status(400).json({status:false,error:"Diseases Name Already Exists"});
        }
        diseases=await diseasesModel.create({diseases_name,symptoms,cvc_report,specific_dignosis_report,discription,user_id});
        for(let drug of drugs){
            var newDrug=await drugsModel.create({user_id,diseases_name,drugs_name:drug});
        }
        return res.status(200).json({status:true});
    }
    catch(e){
        return res.status(500).json({status:false,error:"Server Error....."});
    }
}

const getAllDiseases=async(req,res,next)=>{
    try{
        let {user_id}=req.body;
        let diseasess=await diseasesModel.find({user_id});
        let allDiseases=[]
        for(let diseases of diseasess){
            let drugs=await drugsModel.find({diseases_name:diseases.diseases_name,user_id});
            let alldrugs=[]
            for(let drug of drugs){
                alldrugs.push(drug.drugs_name);
            }
            allDiseases.push({diseases_name:diseases.diseases_name,cvc_report:diseases.cvc_report,drugs_name:alldrugs,symptoms:diseases.symptoms,specific_dignosis_report:diseases.specific_dignosis_report,discription:diseases.discription});
        }
        return res.status(200).json({status:true,data:allDiseases});
    }
    catch(e){
        return res.status(500).json({status:false,error:"Server Error.....",data:[]});
    }
}

const getAllDrugs=async(req,res,next)=>{
    try{
        let {user_id}=req.body;
        let drugs=await drugsModel.find({user_id});
        let alldrugs={}
        for(let drug of drugs){
            if(alldrugs[drug.drugs_name]==undefined){
                alldrugs[drug.drugs_name]=[drug.diseases_name]
            }
            else{
                alldrugs[drug.drugs_name].push(drug.diseases_name);
            }
        }
        let listDrugs=[]
        for(let drug of Object.keys(alldrugs)){
            listDrugs.push({drugs_name:drug,diseases_name:alldrugs[drug]})
        }
        return res.status(200).json({status:true,data:listDrugs});
    }
    catch(e){
        return res.status(500).json({status:false,error:"Server Error.....",data:[]});
    }
}

const deleteDrug=async(req,res,next)=>{
    try{
        let {user_id}=req.body;
        let {id,code}=req.query;
        if(code==1){
            let diseases=await diseasesModel.deleteOne({user_id,diseases_name:id});
            // console.log(code,diseases)
        }
        else{
            let drugs=await drugsModel.deleteMany({user_id,drugs_name:id});
            // console.log(code,drugs)
        }
        // console.log(d)
        return res.status(200).json({status:true});
    }
    catch(e){
        return res.status(500).json({status:false,error:"Server Error....."});   
    }
}

router.post("/",verifyToken,addDiseases);

router.get("/diseases",verifyToken,getAllDiseases);

router.get("/drugs",verifyToken,getAllDrugs);

router.delete("/",verifyToken,deleteDrug);

module.exports=router;