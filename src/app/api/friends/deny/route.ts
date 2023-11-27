import { authOptions } from '@/utils/auth'
import { db } from '@/utils/db'
import { getServerSession } from 'next-auth'
import { z } from 'zod'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { id: idToDeny } = z.object({ id: z.string().trim() }).parse(body)

    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response('You are not authorized', { status: 401 })
    }

    await db.srem(`user:${session.user.id}:incoming_friend_requests`, idToDeny)

    return new Response('Ok', { status: 200 })
  } catch (err) {
    return new Response('Something went wrong', { status: 400 })
  }
}
