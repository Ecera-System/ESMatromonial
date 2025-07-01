"use client"

import { useState } from "react"
import { ProfileCard } from "./profile-card"
import { profiles } from "@/lib/profiles-data"

type FilterType = "all" | "nearby" | "verified"

export function ProfileFeed() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all")

  const filteredProfiles = profiles.filter((profile) => {
    if (activeFilter === "all") return true
    return profile.category === activeFilter
  })

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-6xl font-black bg-gradient-to-r from-red-500 to-lime-400 bg-clip-text text-transparent mb-4 animate-title-float">
          Discover Your Perfect Match
        </h1>
        <p className="text-xl text-white mb-12 text-shadow font-medium">
          Connect with amazing people who share your interests and values
        </p>

        {/* Filters */}
        <div className="flex justify-center gap-6 mb-16 flex-wrap">
          {[
            { key: "all", label: "All Profiles" },
            { key: "nearby", label: "Nearby" },
            { key: "verified", label: "Verified" },
          ].map((filter, index) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key as FilterType)}
              className={`px-8 py-4 rounded-full font-semibold text-lg transition-all duration-500 animate-filter-float ${
                activeFilter === filter.key
                  ? "bg-gradient-to-r from-pink-500 to-indigo-600 text-white -translate-y-2 scale-105 shadow-xl shadow-pink-500/40"
                  : "bg-gradient-to-r from-pink-500 to-indigo-600 text-white hover:-translate-y-2 hover:scale-105 hover:shadow-xl hover:shadow-pink-500/40"
              }`}
              style={{ animationDelay: `${index}s` }}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Profiles Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10 animate-grid-fade-in">
        {filteredProfiles.map((profile, index) => (
          <ProfileCard key={profile.id} profile={profile} index={index} />
        ))}
      </div>
    </div>
  )
}
