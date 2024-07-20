import mongoose from "mongoose";

const AdminSchema=new mongoose.Schema({
   
    email:{
        type: String,  
        unique:true,
        lowercase : true,  
        trim : true,  
        required: true,
    }, 
    
    password:{
        type:String,
        minlength:[8,"Password should be at least 8 characters"],
        required: true,
    }
})

const AdminModel=mongoose.model("Admin",AdminSchema)

export {AdminModel as Admin}