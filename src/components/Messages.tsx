'use client'

import { cn } from '@/utils/clsx'

import { FC, useRef, useState } from 'react'
import { format } from 'date-fns'
import Image from 'next/image'

interface MessagesProps {
  initialMessages: Message[]
  sessionId: string
  sessionImage: string | null | undefined
  chatPartner: User
}

const formatTimeStamp = function (time: number) {
  return format(time, 'HH:mm')
}

const Messages: FC<MessagesProps> = ({
  initialMessages,
  sessionId,
  chatPartner,
  sessionImage,
}) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const scrollDownRef = useRef<HTMLDivElement | null>(null)

  return (
    <div
      id="messages"
      className="flex w-full h-full flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
    >
      <div ref={scrollDownRef} />
      {messages.map((message, index) => {
        const currentUser = sessionId === message.senderId
        const hasNextMessageFromSameUser =
          messages[index - 1]?.senderId === messages[index].senderId
        return (
          <div
            key={message.id}
            id="chat-message"
            className={`${message.id}-${message.timeStamps}`}
          >
            <div
              className={cn('flex items-end', { 'justify-end': currentUser })}
            >
              <div
                className={cn(
                  'flex flex-col space-y-2 text-base max-w-sm mx-2',
                  {
                    'order-1 items-end': currentUser,
                    'order-2 items-start': !currentUser,
                  }
                )}
              >
                <span
                  className={cn(
                    'px-4 py-2 rounded-lg inline-block text-slate-50',
                    {
                      'bg-indigo-600': currentUser,
                      'bg-gray-600': !currentUser,
                      'rounded-br-none':
                        !hasNextMessageFromSameUser && currentUser,
                      'rounded-bl-none':
                        !hasNextMessageFromSameUser && !currentUser,
                    }
                  )}
                >
                  {message.text}{' '}
                  <span className="text-gray-200 text-xs ml-2">
                    {formatTimeStamp(message.timeStamps)}
                  </span>
                </span>
              </div>
              <div
                className={cn('relative w-8 h-8', {
                  'order-2': currentUser,
                  'order-1': !currentUser,
                  invisible: hasNextMessageFromSameUser,
                })}
              >
                <Image
                  alt="Chat"
                  className=" rounded-full"
                  fill
                  referrerPolicy="no-referrer"
                  src={
                    currentUser
                      ? (sessionImage as string)
                      : (chatPartner.image as string)
                  }
                />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Messages
