const mongoose = require("mongoose")
const Profile = require("./models/Profile")

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/matchmate", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const sampleProfiles = [
  {
    name: "Sarah Johnson",
    age: 28,
    location: "San Francisco, CA",
    image: "/placeholder.svg?height=280&width=380",
    verified: true,
    quote:
      "Life is an adventure, and I'm looking for someone to explore it with. Love hiking trails and deep conversations under the stars.",
    job: "Software Engineer at Google",
    education: "Master's in Computer Science",
    height: "5'6\"",
    diet: "Non Vegetarian",
    interests: ["Hiking", "Photography", "Cooking", "Travel", "Yoga", "Wine Tasting"],
    category: ["verified"],
  },
  {
    name: "Michael Chen",
    age: 32,
    location: "Oakland, CA",
    image: "/placeholder.svg?height=280&width=380",
    verified: false,
    quote:
      "Passionate about music and fitness. Looking for someone who values both adventure and quiet moments together.",
    job: "Marketing Director at Spotify",
    education: "MBA from Stanford",
    height: "5'10\"",
    diet: "Vegetarian",
    interests: ["Music", "Fitness", "Wine Tasting", "Skiing", "Concerts", "Basketball"],
    category: ["nearby"],
  },
  {
    name: "Emma Rodriguez",
    age: 26,
    location: "San Jose, CA",
    image: "/placeholder.svg?height=280&width=380",
    verified: true,
    quote:
      "Dedicated to helping others and making a difference. Love dancing and volunteering. Seeking someone with a kind heart.",
    job: "Pediatric Nurse at UCSF",
    education: "BSN from UC Davis",
    height: "5'4\"",
    diet: "Non Vegetarian",
    interests: ["Dancing", "Reading", "Volunteering", "Yoga", "Family Time", "Gardening"],
    category: ["verified"],
  },
  {
    name: "David Kim",
    age: 30,
    location: "Berkeley, CA",
    image: "/placeholder.svg?height=280&width=380",
    verified: false,
    quote:
      "Architecture is my passion, coffee is my fuel. Looking for someone who appreciates creativity and deep conversations.",
    job: "Architect at Gensler",
    education: "M.Arch from UC Berkeley",
    height: "5'9\"",
    diet: "Vegetarian",
    interests: ["Architecture", "Art", "Coffee", "Cycling", "Photography", "Museums"],
    category: ["nearby"],
  },
  {
    name: "Lisa Thompson",
    age: 29,
    location: "Palo Alto, CA",
    image: "/placeholder.svg?height=280&width=380",
    verified: true,
    quote: "Finance professional who loves tennis and theater. Looking for someone ambitious and family-oriented.",
    job: "Financial Analyst at Wells Fargo",
    education: "MBA from Wharton",
    height: "5'7\"",
    diet: "Vegetarian",
    interests: ["Tennis", "Investing", "Theater", "Pilates", "Fine Dining", "Travel"],
    category: ["verified"],
  },
  {
    name: "James Wilson",
    age: 34,
    location: "Napa Valley, CA",
    image: "/placeholder.svg?height=280&width=380",
    verified: false,
    quote:
      "Chef and restaurant owner who loves creating memorable experiences. Looking for someone to share life's flavors with.",
    job: "Chef & Restaurant Owner",
    education: "Culinary Institute of America",
    height: "6'1\"",
    diet: "Non Vegetarian",
    interests: ["Cooking", "Wine", "Gardening", "Surfing", "Food Travel", "Hiking"],
    category: ["nearby"],
  },
  {
  name: "Ciara Delgado",
  age: 29,
  location: "Santa Fe, NM",
  image: "/placeholder.svg?height=280&width=380",
  verified: true,
  quote:
    "Artist and part-time barista. I believe in slow mornings, bold colors, and real conversations.",
  job: "Visual Artist & Barista",
  education: "University of New Mexico",
  height: "5'6\"",
  diet: "Vegetarian",
  interests: ["Painting", "Yoga", "Poetry", "Thrifting", "Nature Walks", "Indie Music"],
  category: ["new"],
},
 {
    name: "James Wilson",
    age: 34,
    location: "Napa Valley, CA",
    image: "/placeholder.svg?height=280&width=380",
    verified: false,
    quote:
      "Chef and restaurant owner who loves creating memorable experiences. Looking for someone to share life's flavors with.",
    job: "Chef & Restaurant Owner",
    education: "Culinary Institute of America",
    height: "6'1\"",
    diet: "Non Vegetarian",
    interests: ["Cooking", "Wine", "Gardening", "Surfing", "Food Travel", "Hiking"],
    category: ["nearby"],
  },
  {
    name: "Ciara Delgado",
    age: 29,
    location: "Santa Fe, NM",
    image: "/placeholder.svg?height=280&width=380",
    verified: true,
    quote:
      "Artist and part-time barista. I believe in slow mornings, bold colors, and real conversations.",
    job: "Visual Artist & Barista",
    education: "University of New Mexico",
    height: "5'6\"",
    diet: "Vegetarian",
    interests: ["Painting", "Yoga", "Poetry", "Thrifting", "Nature Walks", "Indie Music"],
    category: ["new"],
  },
  {
    name: "Amara Singh",
    age: 31,
    location: "Seattle, WA",
    image: "/placeholder.svg?height=280&width=380",
    verified: true,
    quote: "Nature is my therapy. Let’s hike a trail and talk about dreams.",
    job: "Environmental Researcher",
    education: "University of Washington",
    height: "5'5\"",
    diet: "Vegan",
    interests: ["Hiking", "Photography", "Climate Activism", "Coffee", "Journaling"],
    category: ["trending"],
  },
  {
    name: "Lucas Meyer",
    age: 36,
    location: "Denver, CO",
    image: "/placeholder.svg?height=280&width=380",
    verified: false,
    quote:
      "Engineer by day, mountain biker by weekend. Let's ride into something real.",
    job: "Mechanical Engineer",
    education: "Colorado State University",
    height: "5'11\"",
    diet: "Non Vegetarian",
    interests: ["Mountain Biking", "Sci-Fi", "Craft Beer", "Tech Gadgets", "Climbing"],
    category: ["new"],
  },
  {
    name: "Isabella Romero",
    age: 27,
    location: "Miami, FL",
    image: "/placeholder.svg?height=280&width=380",
    verified: true,
    quote:
      "Dancer. Dreamer. Hopeless romantic with a love for salsa and sunsets.",
    job: "Professional Dancer",
    education: "New World School of the Arts",
    height: "5'4\"",
    diet: "Pescatarian",
    interests: ["Dancing", "Beach Walks", "Latte Art", "Astrology", "Travel Vlogs"],
    category: ["recommended"],
  },
  {
    name: "Ethan Brooks",
    age: 30,
    location: "Austin, TX",
    image: "/placeholder.svg?height=280&width=380",
    verified: false,
    quote:
      "Entrepreneur building things that matter. Looking for someone who vibes with ambition and good tacos.",
    job: "Startup Founder",
    education: "UT Austin",
    height: "6'0\"",
    diet: "Omnivore",
    interests: ["Startups", "Barbecue", "Running", "Board Games", "Jazz"],
    category: ["nearby"],
  },
  {
    name: "Naomi Chen",
    age: 33,
    location: "San Francisco, CA",
    image: "/placeholder.svg?height=280&width=380",
    verified: true,
    quote:
      "UX designer on weekdays, stargazer on weekends. Let’s make the little things beautiful.",
    job: "UX Designer",
    education: "UC Berkeley",
    height: "5'7\"",
    diet: "Vegetarian",
    interests: ["Design", "Astronomy", "Podcasts", "Minimalism", "Bouldering"],
    category: ["top picks"],
  },
  {
    name: "Ayaan Qureshi",
    age: 28,
    location: "Chicago, IL",
    image: "/placeholder.svg?height=280&width=380",
    verified: true,
    quote:
      "Bookstore addict, part-time pianist. Swipe right if you love deep convos and dogs.",
    job: "English Professor",
    education: "University of Chicago",
    height: "5'10\"",
    diet: "Halal",
    interests: ["Literature", "Piano", "Dogs", "Chess", "Museum Hopping"],
    category: ["recommended"],
  },
  {
    name: "Lena Kapoor",
    age: 26,
    location: "Brooklyn, NY",
    image: "/placeholder.svg?height=280&width=380",
    verified: false,
    quote:
      "I design clothes, dance in the rain, and believe in serendipity.",
    job: "Fashion Designer",
    education: "Parsons School of Design",
    height: "5'3\"",
    diet: "Non Vegetarian",
    interests: ["Fashion", "Sketching", "K-Dramas", "Vintage Markets", "Dancing"],
    category: ["new"],
  },
  {
    name: "Marco De Luca",
    age: 35,
    location: "Boston, MA",
    image: "/placeholder.svg?height=280&width=380",
    verified: true,
    quote:
      "Italian roots, Boston vibes. Cooking is my love language.",
    job: "Cultural Consultant & Chef",
    education: "Boston University",
    height: "5'9\"",
    diet: "Non Vegetarian",
    interests: ["Cooking", "Opera", "Sailing", "Espresso", "History"],
    category: ["nearby"],
  },
  {
    name: "Zoe Martinez",
    age: 32,
    location: "Los Angeles, CA",
    image: "/placeholder.svg?height=280&width=380",
    verified: true,
    quote:
      "Director and film nerd. I frame stories for a living — now looking to create a real one.",
    job: "Film Director",
    education: "USC School of Cinematic Arts",
    height: "5'8\"",
    diet: "Vegan",
    interests: ["Cinema", "Screenwriting", "Yoga", "Coffee", "Meditation"],
    category: ["trending"],
  },
]

const seedDatabase = async () => {
  try {
    // Clear existing profiles
    await Profile.deleteMany({})
    console.log("Cleared existing profiles")

    // Insert sample profiles
    const profiles = await Profile.insertMany(sampleProfiles)
    console.log(`Inserted ${profiles.length} profiles`)

    console.log("Database seeded successfully!")
    process.exit(0)
  } catch (error) {
    console.error("Error seeding database:", error)
    process.exit(1)
  }
}

seedDatabase()
