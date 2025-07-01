import { NextResponse } from "next/server"
import { profiles } from "@/lib/profiles-data"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const filter = searchParams.get("filter")

  let filteredProfiles = profiles

  if (filter && filter !== "all") {
    filteredProfiles = profiles.filter((profile) => profile.category === filter)
  }

  return NextResponse.json(filteredProfiles)
}
