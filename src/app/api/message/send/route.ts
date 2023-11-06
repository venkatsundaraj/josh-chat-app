import { fetchRedis } from '@/helpers/redis'
import { authOptions } from '@/utils/auth'
import { getServerSession } from 'next-auth'
import { db } from '@/utils/db'
import { messageValidataion } from '@/utils/validations/message'
import { nanoid } from 'nanoid'

export async function POST(req: Request) {
  try {
    const { text, chatId }: { text: string; chatId: string } = await req.json()

    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response('Unauthorized', { status: 401 })
    }

    const [userId1, userId2] = chatId.split('--')

    if (userId1 !== session.user.id && userId2 !== session.user.id) {
      return new Response('Unauthorized', { status: 401 })
    }

    const friendId = session.user.id === userId1 ? userId2 : userId1

    const friendLists = (await fetchRedis(
      'smembers',
      `user:${session.user.id}:friends`
    )) as string[]

    const isFriend = friendLists.includes(friendId)

    if (!isFriend) {
      return new Response('Unauthorized', { status: 401 })
    }

    const rawSender = (await fetchRedis(
      'get',
      `user:${session.user.id}`
    )) as string

    const rawReceiver = (await fetchRedis('get', `user:${friendId}`)) as string

    const sender = (await JSON.parse(rawSender)) as User
    const receiver = (await JSON.parse(rawReceiver)) as User

    const timeStamp = Date.now()

    const messageData: Message = {
      id: nanoid(),
      senderId: sender.id,
      receiverId: receiver.id,
      timeStamps: timeStamp,
      text: text,
    }

    const message = messageValidataion.parse(messageData)

    await db.zadd(`chat:${chatId}:messages`, {
      score: timeStamp,
      member: JSON.stringify(message),
    })
    return new Response('Ok', { status: 200 })
  } catch (err) {
    if (err instanceof Error) {
      return new Response(err.message, { status: 500 })
    }

    return new Response('Internal Server Error', { status: 500 })
  }
}
