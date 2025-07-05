import { useState } from "react";
import { Heart, MessageCircle, Briefcase, GraduationCap, MapPin, Star, Filter } from "lucide-react";

// Sample profiles data
const profiles = [
  {
    id: 1,
    name: "Priya Sharma",
    age: 26,
    location: "Mumbai, Maharashtra",
    image: "https://images.unsplash.com/photo-1494790108755-2616b332c37d?w=400&h=600&fit=crop",
    job: "Software Engineer",
    education: "MBA from IIM Mumbai",
    height: "5'5\"",
    interests: ["Travel", "Reading", "Yoga", "Cooking", "Photography"],
    quote: "Looking for a life partner who believes in growing together and creating beautiful memories.",
    verified: true,
    category: "verified"
  },
  {
    id: 2,
    name: "Arjun Patel",
    age: 29,
    location: "Ahmedabad, Gujarat",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
    job: "Doctor",
    education: "MBBS from AIIMS",
    height: "5'10\"",
    interests: ["Music", "Sports", "Traveling", "Reading"],
    quote: "Believe in traditional values with a modern outlook. Family comes first.",
    verified: true,
    category: "nearby"
  },
  {
    id: 3,
    name: "Ananya Singh",
    age: 24,
    location: "Delhi, NCR",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop",
    job: "Teacher",
    education: "B.Ed from Delhi University",
    height: "5'4\"",
    interests: ["Dancing", "Art", "Teaching", "Nature"],
    quote: "Simple person with big dreams. Looking for someone who values relationships.",
    verified: false,
    category: "all"
  },
  {
    id: 4,
    name: "Rohit Gupta",
    age: 31,
    location: "Bangalore, Karnataka",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop",
    job: "Business Analyst",
    education: "MBA from ISB Hyderabad",
    height: "6'0\"",
    interests: ["Cricket", "Technology", "Movies", "Fitness"],
    quote: "Tech enthusiast who loves cricket and good food. Seeking a understanding partner.",
    verified: true,
    category: "verified"
  },
  {
    id: 5,
    name: "Kavya Reddy",
    age: 27,
    location: "Hyderabad, Telangana",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop",
    job: "Interior Designer",
    education: "B.Des from NIFT",
    height: "5'6\"",
    interests: ["Design", "Art", "Travel", "Fashion"],
    quote: "Creative soul looking for someone who appreciates art and life's beautiful moments.",
    verified: true,
    category: "nearby"
  },
  {
    id: 6,
    name: "Vikram Joshi",
    age: 28,
    location: "Pune, Maharashtra",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop",
    job: "Marketing Manager",
    education: "MBA from Symbiosis",
    height: "5'9\"",
    interests: ["Photography", "Trekking", "Food", "Music"],
    quote: "Adventure seeker with a passion for life. Looking for a companion for life's journey.",
    verified: false,
    category: "all"
  }
];

// Profile Card Component
function ProfileCard({ profile, index }) {
  const [isLiked, setIsLiked] = useState(false);
  const [isMessageSent, setIsMessageSent] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleMessage = () => {
    setIsMessageSent(true);
    setTimeout(() => setIsMessageSent(false), 2000);
  };

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] group">
      {/* Profile Image */}
      <div className="relative h-80 overflow-hidden">
        <img
          src={profile.image}
          alt={profile.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        {profile.verified && (
          <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
            <Star className="w-3 h-3 fill-current" />
            Verified
          </div>
        )}
      </div>

      {/* Profile Content */}
      <div className="p-6">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">{profile.name}</h3>
          <div className="flex items-center text-gray-600 mb-3">
            <span className="font-medium">{profile.age} years</span>
            <span className="mx-2">•</span>
            <MapPin className="w-4 h-4 mr-1" />
            <span>{profile.location}</span>
          </div>
        </div>

        {/* Quote */}
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-xl mb-4 border-l-4 border-pink-400">
          <p className="text-gray-700 italic text-sm leading-relaxed">{profile.quote}</p>
        </div>

        {/* Details */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            <span className="text-gray-700 font-medium">{profile.job}</span>
          </div>
          <div className="flex items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center mr-3">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <span className="text-gray-700 font-medium">{profile.education}</span>
          </div>
        </div>

        {/* Interests */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wide">Interests</h4>
          <div className="flex flex-wrap gap-2">
            {profile.interests.slice(0, 4).map((interest, idx) => (
              <span
                key={interest}
                className="bg-gradient-to-r from-pink-100 to-purple-100 text-gray-800 px-3 py-1 rounded-full text-xs font-medium hover:from-pink-200 hover:to-purple-200 transition-colors duration-200"
              >
                {interest}
              </span>
            ))}
            {profile.interests.length > 4 && (
              <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs">
                +{profile.interests.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleLike}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
              isLiked
                ? "bg-gradient-to-r from-pink-500 to-red-500 text-white transform scale-105"
                : "bg-gradient-to-r from-pink-500 to-red-500 text-white hover:shadow-lg hover:shadow-pink-500/30 hover:-translate-y-1"
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
            {isLiked ? "Liked" : "Like"}
          </button>
          <button
            onClick={handleMessage}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
              isMessageSent
                ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                : "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-1"
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            {isMessageSent ? "Sent!" : "Message"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Header Component
function Header() {
  return (
    <header className="bg-white/95 backdrop-blur-lg shadow-lg sticky top-0 z-50 border-b border-gray-100">
      <nav className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="text-3xl font-black bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            ♥ MatrimonyHub
          </div>
          <div className="hidden md:flex items-center gap-8">
            {["Discover", "Matches", "Messages", "Profile"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-gray-700 font-medium px-4 py-2 rounded-full transition-all duration-300 hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-600 hover:text-white hover:shadow-lg"
              >
                {item}
              </a>
            ))}
          </div>
          <button className="md:hidden p-2 rounded-lg hover:bg-gray-100">
            <Filter className="w-6 h-6" />
          </button>
        </div>
      </nav>
    </header>
  );
}

// Main Feed Component
export default function MatrimonyFeed() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredProfiles = profiles.filter((profile) => {
    if (activeFilter === "all") return true;
    return profile.category === activeFilter;
  });

  const filters = [
    { key: "all", label: "All Profiles", count: profiles.length },
    { key: "verified", label: "Verified", count: profiles.filter(p => p.verified).length },
    { key: "nearby", label: "Nearby", count: profiles.filter(p => p.category === "nearby").length },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Find Your Perfect Match
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Discover meaningful connections with people who share your values, interests, and life goals
          </p>
          
          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {filters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 ${
                  activeFilter === filter.key
                    ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/30 transform -translate-y-1"
                    : "bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg hover:-translate-y-1"
                }`}
              >
                {filter.label}
                <span className={`px-2 py-1 rounded-full text-xs ${
                  activeFilter === filter.key 
                    ? "bg-white/20 text-white" 
                    : "bg-gray-100 text-gray-600"
                }`}>
                  {filter.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Profiles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProfiles.map((profile, index) => (
            <div
              key={profile.id}
              className="opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
            >
              <ProfileCard profile={profile} index={index} />
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl hover:shadow-pink-500/30 hover:-translate-y-1 transition-all duration-300">
            Load More Profiles
          </button>
        </div>
      </main>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}