const mongoose = require("mongoose")

const profileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    quote: {
      type: String,
      required: true,
    },
    job: {
      type: String,
      required: true,
    },
    education: {
      type: String,
      required: true,
    },
    height: {
      type: String,
      required: true,
    },
    diet: {
      type: String,
      required: true,
    },
    interests: [
      {
        type: String,
      },
    ],
    category: [
      {
        type: String,
      },
    ],
    likes: {
      type: Number,
      default: 0,
    },
    messages: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("Profile", profileSchema)
