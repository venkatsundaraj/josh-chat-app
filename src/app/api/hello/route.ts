import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    // const data = await req.json()
    const data = 'hello'
    return new Response(data, { status: 200 })
  } catch (err) {
    console.log(err)
  }
}

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const { email } = await req.json()
    if (!email) {
      return new Response('Should have email', { status: 401 })
    }
    console.log(email)
    const data = email
    return new Response(data, { status: 200 })
  } catch (err) {
    console.log(err)
  }
}
