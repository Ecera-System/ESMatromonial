"use client"

import { useState } from "react"
import { Heart, MessageCircle, Briefcase, GraduationCap, Ruler } from "lucide-react"
import type { Profile } from "@/lib/profiles-data"

interface ProfileCardProps {
  profile: Profile
  index: number
}

export function ProfileCard({ profile, index }: ProfileCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isMessageSent, setIsMessageSent] = useState(false)

  const handleLike = () => {
    setIsLiked(true)
    // Create floating hearts animation
    createFloatingHearts()
  }

  const handleMessage = () => {
    setIsMessageSent(true)
    setTimeout(() => setIsMessageSent(false), 2000)
  }

  const createFloatingHearts = () => {
    // This would be implemented with a more complex animation system
    // For now, we'll just show the liked state
  }

  return (
    <div
      className="bg-white/95 rounded-3xl overflow-hidden shadow-xl transition-all duration-500 hover:-translate-y-4 hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/20 animate-card-slide-in"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Profile Image */}
      <div className="relative h-72 overflow-hidden">
        <img
          src={profile.image || "/placeholder.svg"}
          alt={profile.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
      </div>

      {/* Profile Info */}
      <div className="p-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">{profile.name}</h3>
            <p className="text-gray-600 font-medium">
              {profile.age} • {profile.location}
            </p>
          </div>
          {profile.verified && (
            <span className="bg-gradient-to-r from-indigo-600 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-semibold animate-badge-pulse">
              ✓ Verified
            </span>
          )}
        </div>

        {/* Quote */}
        <div className="bg-gradient-to-r from-pink-50 to-indigo-50 p-4 rounded-2xl mb-6 border-l-4 border-pink-500">
          <p className="text-gray-600 italic text-sm leading-relaxed">{profile.quote}</p>
        </div>

        {/* Details */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center p-3 bg-indigo-50/50 rounded-xl transition-all duration-300 hover:bg-indigo-50 hover:translate-x-1">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-indigo-600 rounded-full flex items-center justify-center mr-4 animate-icon-spin">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            <span className="text-gray-700 font-medium">{profile.job}</span>
          </div>
          <div className="flex items-center p-3 bg-indigo-50/50 rounded-xl transition-all duration-300 hover:bg-indigo-50 hover:translate-x-1">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-indigo-600 rounded-full flex items-center justify-center mr-4 animate-icon-spin">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <span className="text-gray-700 font-medium">{profile.education}</span>
          </div>
          <div className="flex items-center p-3 bg-indigo-50/50 rounded-xl transition-all duration-300 hover:bg-indigo-50 hover:translate-x-1">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-indigo-600 rounded-full flex items-center justify-center mr-4 animate-icon-spin">
              <Ruler className="w-4 h-4 text-white" />
            </div>
            <span className="text-gray-700 font-medium">
              {profile.height} • {profile.diet}
            </span>
          </div>
        </div>

        {/* Interests */}
        <div className="mb-8">
          <h4 className="font-bold text-gray-800 mb-4 text-lg">🎯 Interests</h4>
          <div className="flex flex-wrap gap-3">
            {profile.interests.map((interest, idx) => (
              <span
                key={interest}
                className="bg-gradient-to-r from-pink-100 to-indigo-100 text-gray-700 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-110 hover:from-pink-200 hover:to-indigo-200 animate-tag-float"
                style={{ animationDelay: `${idx % 2 === 0 ? "0s" : "2s"}` }}
              >
                {interest}
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-6">
          <button
            onClick={handleLike}
            className={`flex-1 py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-400 ${
              isLiked
                ? "bg-gradient-to-r from-purple-400 to-pink-500 text-white scale-110"
                : "bg-gradient-to-r from-pink-500 to-purple-400 text-white hover:-translate-y-1 hover:scale-105 hover:shadow-lg hover:shadow-pink-500/30"
            }`}
          >
            <Heart className="w-5 h-5 inline mr-2" />
            {isLiked ? "Liked!" : "Like"}
          </button>
          <button
            onClick={handleMessage}
            className={`flex-1 py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-400 ${
              isMessageSent
                ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white"
                : "bg-gradient-to-r from-indigo-600 to-purple-500 text-white hover:-translate-y-1 hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/30"
            }`}
          >
            <MessageCircle className="w-5 h-5 inline mr-2" />
            {isMessageSent ? "✓ Message Sent" : "Message"}
          </button>
        </div>
      </div>
    </div>
  )
}
