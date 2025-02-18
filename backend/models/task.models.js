import mongoose from "mongoose";

const AplySchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    imageUrls: {
      type: Array,
      trim: true,
    },
    status: {
      type: Boolean,
    },
    userRef: {
      type: String,
    },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", AplySchema);
export default Task;
