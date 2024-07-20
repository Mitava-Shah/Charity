import mongoose from "mongoose";

const AgentSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required: true,
        set: (value) => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
    }
    ,lastName:{
        type:String,
        required: true,
        set: (value) => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
    },
    email:{
        type: String,    
        unique:true,
        lowercase : true,  
        trim : true,  
        required: true,
    }, 
    username:{
        type:String,
        unique:true
    },
    contactNo:{
        type:Number,
        required: true,
    },
    address:{
        type:String,
        required: true,
        set: (value) => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
    },
    area:{
        type:String,
        required:true,
    },
    city:{
        type:String,
        required: true,
        set: (value) => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
    },
    pincode:{
        type:Number,
        minlength:6,
        maxlength:10,
        required: true,
    },
    password:{
        type:String,
        minlength:[8,"Password should be at least 8 characters"],
        required: true,
    }
})

const AgentModel=mongoose.model("Agent",AgentSchema)

export {AgentModel as Agent}