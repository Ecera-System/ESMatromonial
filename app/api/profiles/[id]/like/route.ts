import { NextResponse } from "next/server"

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // In a real app, you would save this to a database
  console.log(`User liked profile ${id}`)

  return NextResponse.json({
    success: true,
    message: `Profile ${id} liked successfully`,
  })
}
