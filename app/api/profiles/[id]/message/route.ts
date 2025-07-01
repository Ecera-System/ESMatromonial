import { NextResponse } from "next/server"

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()

  // In a real app, you would save this to a database
  console.log(`Message sent to profile ${id}:`, body.message)

  return NextResponse.json({
    success: true,
    message: `Message sent to profile ${id} successfully`,
  })
}
