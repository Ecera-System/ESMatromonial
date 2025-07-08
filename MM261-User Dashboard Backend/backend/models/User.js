import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  avatar: String,//Make sure this field exists
  email: String,
  gender: String,
  dob: Date,
});

export default mongoose.model("User", userSchema);
