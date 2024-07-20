import mongoose from "mongoose";

const DonorSchema = new mongoose.Schema({
    firstName: {
        type: String,
        null: false,
        set: (value) => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
    }
    , lastName: {
        type: String,
        null: false,
        set: (value) => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        null: false

    },
    username: {
        type: String,
        unique: true,
        trim: true,
        null: false
    },
    contactNo: {
        type: Number,
        null: false
    },
    address: {
        type: String,
        null: false,
        set: (value) => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
    },
    city: {
        type: String,
        null: false,
        set: (value) => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
    },
    pincode: {
        type: Number,
        minlength: 6,
        maxlength: 10,
        null: false
    },
    password: {
        type: String,
        minlength: [8, "Password should be at least 8 characters"],
        null: false,
    }
})

const DonorModel = mongoose.model("Donor", DonorSchema)

export { DonorModel as Donor }