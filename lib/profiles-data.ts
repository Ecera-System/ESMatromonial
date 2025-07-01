export interface Profile {
  id: number
  name: string
  age: number
  location: string
  image: string
  verified: boolean
  quote: string
  job: string
  education: string
  height: string
  diet: string
  interests: string[]
  category: "verified" | "nearby"
}

export const profiles: Profile[] = [
  {
    id: 1,
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
    category: "verified",
  },
  {
    id: 2,
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
    category: "nearby",
  },
  {
    id: 3,
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
    category: "verified",
  },
  {
    id: 4,
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
    category: "nearby",
  },
  {
    id: 5,
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
    category: "verified",
  },
  {
    id: 6,
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
    category: "nearby",
  },
]
