import { fetchRedis } from '@/helpers/redis'
import { authOptions } from '@/utils/auth'
import { getServerSession } from 'next-auth'
import { db } from '@/utils/db'
import { z } from 'zod'
import { AxiosError } from 'axios'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { id: idToAdd } = z.object({ id: z.string().trim() }).parse(body)

    const session = await getServerSession(authOptions)
    if (!session) {
      return new Response('Unauthorized', { status: 401 })
    }

    const hasAlreadyFriends = (await fetchRedis(
      'sismember',
      `user:${session.user.id}:friends`,
      idToAdd
    )) as 0 | 1

    if (hasAlreadyFriends) {
      return new Response('You are already in friend List', { status: 401 })
    }

    const hasFriendRequested = (await fetchRedis(
      'sismember',
      `user:${session.user.id}:incoming_friend_requests`,
      idToAdd
    )) as 0 | 1

    if (!hasFriendRequested) {
      return new Response('No friend Request', { status: 400 })
    }

    await db.sadd(`user:${session.user.id}:friends`, idToAdd)

    await db.sadd(`user:${idToAdd}:friends`, session.user.id)

    await db.srem(`user:${session.user.id}:incoming_friend_requests`, idToAdd)

    return new Response('ok', { status: 200 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return new Response('Invalid input data', { status: 422 })
    }
    if (err instanceof AxiosError) {
      return new Response('Invalid Request', { status: 400 })
    }
    return new Response('Something went wrong', { status: 400 })
  }
}
