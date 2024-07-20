import mongoose from "mongoose";

const DonationSchema = new mongoose.Schema({

    email: {
        type: String,
        lowercase: true,
        trim: true,
        // required: true,
    },

    contactno: {
        type: Number,
        // required:true
    },

    addresstocollect: {
        type: String,
        set: (value) => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
        // required:true
    },
    area: {
        type: String,
      
    },
    username: {
        type: String,
    },
    donationtype: {
        type: String,
        set: (value) => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
        // required:true
    },

    condition: {
        type: String,

    },

    amount: {
        type: Number,
    },

    quantity: {
        type: String,
        // required:true
    },

    timeofcooking: {
        type: Date,
    },

    Status: {
        type: String,
        // required:true,
        default: "Pending"
    },

    addresstodonate: {
        type: String,
        default:'',
        set: (value) => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
        // required:true,
    },

    message: {
        type: String,
        set: (value) => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
    },

    agentusername: {
        type: String,
        default: ''
    }

})

const DonationModel = mongoose.model("Donation", DonationSchema)

export { DonationModel as Donation }