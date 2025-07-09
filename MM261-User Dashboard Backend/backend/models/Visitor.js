import mongoose from "mongoose";

const visitorSchema = new mongoose.Schema({
  name: String,
  avatarUrl: String,
  userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true
}


});

const Visitor = mongoose.model("Visitor", visitorSchema);
export default Visitor;
