const express = require("express")
const router = express.Router()
const Profile = require("../models/Profile")

router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().sort({ createdAt: -1 })
    res.json(profiles)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get profile by ID
router.get("/:id", async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id)
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" })
    }
    res.json(profile)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Like a profile
router.post("/:id/like", async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id)
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" })
    }

    profile.likes += 1
    await profile.save()

    res.json({ message: "Profile liked successfully", likes: profile.likes })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Send message to profile
router.post("/:id/message", async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id)
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" })
    }

    profile.messages += 1
    await profile.save()

    res.json({ message: "Message sent successfully", messages: profile.messages })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Create new profile
router.post("/", async (req, res) => {
  try {
    const profile = new Profile(req.body)
    const savedProfile = await profile.save()
    res.status(201).json(savedProfile)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

module.exports = router
