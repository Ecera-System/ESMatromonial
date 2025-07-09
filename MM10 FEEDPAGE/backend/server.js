const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const profileRoutes = require("./routes/profiles")

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/matchmate", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const db = mongoose.connection
db.on("error", console.error.bind(console, "connection error:"))
db.once("open", () => {
  console.log("Connected to MongoDB")
})

// Routes
app.use("/api/profiles", profileRoutes)

app.get("/", (req, res) => {
  res.json({ message: "MatchMate API is running!" })
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
