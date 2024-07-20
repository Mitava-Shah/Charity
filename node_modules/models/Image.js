import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
   
    path: {
        type: String,
        required: true, 
      },
      description: {
        type: String,
        default: '',
      },
})

const ImageModel = mongoose.model('Image', imageSchema);

export {ImageModel as Image}