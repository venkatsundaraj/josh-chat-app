import { fetchRedis } from '@/helpers/redis'
import { authOptions } from '@/utils/auth'
import { toPusherKey } from '@/utils/clsx'
import { db } from '@/utils/db'
import { pusherServer } from '@/utils/pusher'
import { addFriendValidator } from '@/utils/validations/add-friend'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

export const POST = async function (req: NextRequest, res: NextResponse) {
  try {
    const body = await req.json()

    const { email: emailToAdd } = addFriendValidator.parse(body.email)

    const idToAdd = (await fetchRedis(
      'get',
      `user:email:${emailToAdd}`
    )) as string

    if (!idToAdd) {
      return new Response('This person does not exist', { status: 400 })
    }
    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response('Unauthorized', { status: 401 })
    }
    if (idToAdd === session.user.id) {
      return new Response('You cannot make you as your friend', {
        status: 400,
      })
    }

    //check user already given request to us
    const isAlreadyAdded = (await fetchRedis(
      'sismember',
      `user:${idToAdd}:incoming_friend_requests`,
      session.user.id
    )) as 0 | 1

    const isAlreadyAgain = (await fetchRedis(
      'sismember',
      `user:${session.user.id}:incoming_friend_requests`,
      idToAdd
    )) as 0 | 1

    //

    if (isAlreadyAdded || isAlreadyAgain) {
      return new Response('Please check your request box', { status: 400 })
    }

    //check user if is in friend list
    const isAlreadyFriends = (await fetchRedis(
      'sismember',
      `user:${session.user.id}:friends`,
      idToAdd
    )) as 0 | 1

    if (isAlreadyFriends) {
      return new Response('You are already in friend list', { status: 400 })
    }

    // pusherServer.trigger(
    //   toPusherKey(`user:${idToAdd}:incoming_friend_requests`),
    //   'incoming_friend_requests',
    //   {
    //     senderId: session.user.id,
    //     senderEmail: session.user.email,
    //   }
    // )

    db.sadd(`user:${idToAdd}:incoming_friend_requests`, session.user.id)

    return new Response('ok', { status: 200 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return new Response('Invalid request payload', { status: 422 })
    }
    return new Response('Invalid Request', { status: 400 })
  }
}
