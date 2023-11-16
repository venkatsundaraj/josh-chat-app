'use client'

import { User } from 'lucide-react'
import Link from 'next/link'
import { FC, useState, useEffect } from 'react'
import { pusherClient } from '@/utils/pusher'
import { toPusherKey } from '@/utils/clsx'

interface FriendRequestSidebarOptionProps {
  initialUnSeenRequestCount: number
  sessionId: string
}

const FriendRequestSidebarOption: FC<FriendRequestSidebarOptionProps> = ({
  sessionId,
  initialUnSeenRequestCount,
}) => {
  const [unSeenRequestCount, setunSeenRequestCount] = useState<number>(
    initialUnSeenRequestCount
  )

  useEffect(() => {
    pusherClient.subscribe(
      toPusherKey(`user:${sessionId}:incoming_friend_requests`)
    )

    const friendRequestHandler = function () {
      setunSeenRequestCount((prev) => prev + 1)
    }
    pusherClient.bind('incoming_friend_requests', friendRequestHandler)

    return () => {
      pusherClient.unsubscribe(
        toPusherKey(`user:${sessionId}:incoming_friend_requests`)
      )
      pusherClient.unbind('incoming_friend_requests', friendRequestHandler)
    }
  }, [])
  return (
    <Link
      href="/dashboard/requests"
      className="text-gray-700 py-2 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-mdp-2 text-sm leading-6 font-medium"
    >
      <div className="hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center border rounded-lg font-medium text-[0.625rem]">
        <User className="w-8 h-8 " />
      </div>
      <p className="truncate">Friend Requests</p>
      {unSeenRequestCount > 0 ? (
        <div className="bg-indigo-600 rounded-full text-slate-50 w-5 h-5 flex items-center justify-center text-sm">
          <span className="block"> {unSeenRequestCount}</span>
        </div>
      ) : null}
    </Link>
  )
}

export default FriendRequestSidebarOption
