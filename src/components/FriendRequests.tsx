'use client'

import { toPusherKey } from '@/utils/clsx'
import { pusherClient } from '@/utils/pusher'
import axios from 'axios'
import { Check, UserPlus, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FC, useEffect, useState } from 'react'

interface FriendRequestsProps {
  incomingFriendRequests: IncomingFriendRequest[]
  sessionId: string
}

const FriendRequests: FC<FriendRequestsProps> = ({
  incomingFriendRequests,
  sessionId,
}) => {
  const [friendRequests, setFriendRequests] = useState<IncomingFriendRequest[]>(
    incomingFriendRequests
  )

  useEffect(() => {
    pusherClient.subscribe(
      toPusherKey(`user:${sessionId}:incoming_friend_requests`)
    )

    const friendRequestHandler = function ({
      senderId,
      senderEmail,
    }: IncomingFriendRequest) {
      setFriendRequests((prev) => [...prev, { senderEmail, senderId }])
    }
    pusherClient.bind('incoming_friend_requests', friendRequestHandler)

    return () => {
      pusherClient.unsubscribe(
        toPusherKey(`user:${sessionId}:incoming_friend_requests`)
      )
      pusherClient.unbind('incoming_friend_requests', friendRequestHandler)
    }
  }, [])

  const router = useRouter()

  const acceptFriend = async function (senderId: string) {
    await axios.post('/api/friends/accept', { id: senderId })

    setFriendRequests((prev) =>
      prev.filter((item) => item.senderId !== senderId)
    )

    router.refresh()
  }

  // acceptFriend('1234')

  const denyFriend = async function (senderId: string) {
    await axios.post('/api/friends/deny', { id: senderId })

    setFriendRequests((prev) =>
      prev.filter((item) => item.senderId !== senderId)
    )

    router.refresh()
  }

  return (
    <>
      {friendRequests.length === 0 ? (
        <p>You have no friend Request</p>
      ) : (
        friendRequests.map((request) => (
          <div
            className="group flex flex-row items-center gap-6 justify-start"
            key={request.senderId}
          >
            <span className="border w-6 h-6 grid place-items-center rounded-sm">
              <UserPlus className="hover:text-violet-400 border hover:border-indigo-400" />
            </span>
            <p>{request.senderEmail}</p>
            <button
              onClick={() => acceptFriend(request.senderId)}
              aria-label="accept friend"
              className="grid place-items-center w-8 h-8 rounded-full bg-indigo-600 hover:shadow-sm hover:bg-indigo-700"
            >
              <Check className="font-semibold text-white w-3/4 h-3/4" />
            </button>
            <button
              onClick={() => denyFriend(request.senderId)}
              aria-label="deny friend"
              className="grid place-items-center w-8 h-8 rounded-full bg-red-600 hover:shadow-sm hover:bg-red-700"
            >
              <X className="font-semibold text-white w-3/4 h-3/4" />
            </button>
          </div>
        ))
      )}
    </>
  )
}

export default FriendRequests
