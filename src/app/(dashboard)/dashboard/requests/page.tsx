import { fetchRedis } from '@/helpers/redis'
import { authOptions } from '@/utils/auth'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'
import { FC } from 'react'
import FriendRequests from '@/components/FriendRequests'

interface pageProps {}

const page = async ({}: pageProps) => {
  const session = await getServerSession(authOptions)
  if (!session) notFound()

  const incomingSenderIds = (await fetchRedis(
    'smembers',
    `user:${session.user.id}:incoming_friend_requests`
  )) as string[]

  const incomingFriendRequests = await Promise.all(
    incomingSenderIds.map(async (senderId) => {
      const sender = (await fetchRedis('get', `user:${senderId}`)) as string

      const senderRequest = JSON.parse(sender) as User

      return {
        senderId,
        senderEmail: senderRequest.email,
      }
    })
  )

  return (
    <main className=" mt-8 w-full">
      <div className="flex flex-col gap-4">
        <FriendRequests
          incomingFriendRequests={incomingFriendRequests}
          sessionId={session.user.id}
        />
      </div>
    </main>
  )
}

export default page
