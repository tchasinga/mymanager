import mongoose from "mongoose";

const AplySchema = new mongoose.Schema({
     title : {
        type: String,
    },
    description: {
        type: String,
    },
    imageUrls: {
        type: Array,
        trim: true,
    },
    userRef: { 
        type: String,
      },
}, {timestamps: true});

const Aply = mongoose.model("Aply", AplySchema);
export default Aply;