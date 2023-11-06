'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FC, ReactNode, useEffect, useState } from 'react'

interface pageProps {
  children: ReactNode
}

type User = {
  name: string
  email: string
  id: string
}

interface Message {
  text: string
  senderId: string
}
const Users = [
  { name: 'venkat', email: 'venkat@gmail.com', id: '1' },
  { name: 'sarathi', email: 'sarathi@gmail.com', id: '2' },
  { name: 'vimal', email: 'vimal@gmail.com', id: '3' },
] as User[]

const Messages = [
  { text: 'Hello world', senderId: '1' },
  { text: 'Hello world', senderId: '1' },
  { text: 'Hello world', senderId: '1' },
] as Message[]

const page: FC<pageProps> = ({ children }) => {
  const pathname = usePathname()
  const [unseenMessages, setUnseenMessages] = useState<Message[]>(Messages)

  useEffect(() => {
    if (pathname?.includes('/d-chat/1')) {
      setUnseenMessages((prev) => {
        return prev.filter((prevArr) => !prevArr.senderId)
      })
    }
  }, [pathname])

  return (
    <main className="flex items-center justify-center flex-col w-full">
      <div className="flex flex-col space-y-3 items-center justify-start">
        {Users.map((person) => {
          return (
            <Link
              key={person.id}
              className="flex items-center justify-between px-4 py-2 "
              href={`/dashboard/d-chat/${person.id}`}
            >
              <span>{person.name}</span>
            </Link>
          )
        })}
        {
          <span className="text-3xl text-teal-500">
            {unseenMessages?.length}
          </span>
        }
      </div>
      <div>{children}</div>
    </main>
  )
}

export default page
