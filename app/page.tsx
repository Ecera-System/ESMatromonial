"use client"
import { Header } from "@/components/header"
import { ProfileFeed } from "@/components/profile-feed"
import { FloatingElements } from "@/components/floating-elements"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-400 bg-[length:400%_400%] animate-gradient-shift overflow-x-hidden relative">
      <FloatingElements />
      <Header />
      <main className="max-w-7xl mx-auto px-4 pt-32 pb-8">
        <ProfileFeed />
      </main>
    </div>
  )
}
