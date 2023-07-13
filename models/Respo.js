import mongoose from "mongoose";

const respoSchema = new mongoose.Schema({}, { collection: "respo" });

export default mongoose.model("respo", respoSchema);
