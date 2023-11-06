'use client'

import { authOptions } from '@/utils/auth'
import { chatIdsConstructor } from '@/utils/clsx'
import { getServerSession } from 'next-auth'
import { usePathname, useRouter } from 'next/navigation'
import { FC, useEffect, useState } from 'react'

interface SideBarChatListProps {
  friends: User[]
  sessionId: string
}

const SideBarChatList: FC<SideBarChatListProps> = ({ friends, sessionId }) => {
  const [unseenMessages, setUnseenMessages] = useState<Message[]>([])
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (pathname?.includes('/chat')) {
      setUnseenMessages((prev) => {
        return prev?.filter((msg) => !pathname.includes(msg.senderId))
      })
    }
  }, [pathname])

  return (
    <ul role="list" className="max-h-[25rem] overflow-y-auto -mx-2 space-y-2">
      {friends.sort().map((friend) => {
        const unSeenMessageCount = unseenMessages.filter((unSeenMsg) => {
          return unSeenMsg.senderId === friend.id
        }).length
        return (
          <li key={friend.id} className="">
            <a
              className="text-sm  rounded-md hover:bg-zinc-50 p-2 text-left leading-6 truncate flex items-center justify-between hover:text-indigo-600 text-gray-700"
              href={`/dashboard/chat/${chatIdsConstructor(
                sessionId,
                friend.id
              )}`}
            >
              {friend.name}
              {unSeenMessageCount > 0 ? (
                <div className="w-4 h-4 font-medium text-sm flex items-center justify-center bg-indigo-600 p-3 text-white rounded-full">
                  {unSeenMessageCount}
                </div>
              ) : null}
            </a>
          </li>
        )
      })}
    </ul>
  )
}

export default SideBarChatList
