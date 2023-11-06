import { Icon, Icons } from '@/components/Icons'
import { authOptions } from '@/utils/auth'
import { getServerSession } from 'next-auth'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import SignOutButton from '@/components/SignOutButton'
import { FC, ReactNode } from 'react'
import FriendRequestSidebarOption from '@/components/FriendRequestSidebarOption'
import { fetchRedis } from '@/helpers/redis'
import { getFriendsByUserId } from '@/helpers/get-friends-by-userid'
import SideBarChatList from '@/components/SideBarChatList'

interface LayoutProps {
  children: ReactNode
}

interface SidebarOptions {
  id: number
  name: string
  Icon: Icon
  href: string
}

const sidebarOptions: SidebarOptions[] = [
  { id: 1, name: 'Add Friend', href: '/dashboard/add', Icon: 'UserPlus' },
]
const Layout = async function ({ children }: LayoutProps) {
  const session = await getServerSession(authOptions)

  if (!session) notFound()

  const unseenFriendRequest = (
    (await fetchRedis(
      'smembers',
      `user:${session.user.id}:incoming_friend_requests`
    )) as string[]
  ).length

  const friends = await getFriendsByUserId(session.user.id)

  return (
    <div className="w-full h-screen flex">
      <div className="w-full grow max-w-xs flex flex-col gap-y-5 h-full overflow-hidden border-r border-gray-200 bg-white px-6">
        <Link href="/dashboard" className="flex h-16 shrink-0 items-center">
          <Icons.Logo className="h-8 w-auto text-indigo-600" />
        </Link>

        <nav className="flex flex-col flex-1 gap-y-2">
          <h2 className="leading-6 font-semibold text-xs text-gray-400">
            Your chats
          </h2>
          <ul className="flex flex-col flex-1 gap-y-2" role="list">
            {friends.length > 0 ? (
              <li>
                <SideBarChatList
                  friends={friends}
                  sessionId={session.user.id}
                />
              </li>
            ) : null}
            <li>
              <div className="text-xs font-semibold text-gray-400 leading-6">
                Overview
              </div>
              <ul role="list" className="-mx-2 mt-2 space-y-1">
                {sidebarOptions.map((option) => {
                  const Icon = Icons[option.Icon]
                  return (
                    <li key={option.id}>
                      <Link
                        href={option.href}
                        className="text-gray-700 hover:text-indigo-600 flex gap-3 rounded-sm hover:bg-gray-50 p-2 leading-6 group text-sm font-semibold"
                      >
                        <span className="w-6 h-6 flex group-hover:text-indigo-600 items-center justify-center border rounded-lg  font-medium text-[0.625rem] text-gray-400 bg-white">
                          <Icon className="h-6 w-6" />
                        </span>
                        <span className="truncate">{option.name}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>

              <FriendRequestSidebarOption
                sessionId={session.user.id}
                initialUnSeenRequestCount={unseenFriendRequest}
              />
            </li>
            <li className="-mr-6 flex items-center mt-auto">
              <div className="flex flex-1 items-center gap-1 px-2 py-3 text-sm font-semibold leading-6">
                <div className="relative w-8 h-8 bg-gray-50 rounded-full overflow-hidden">
                  <Image
                    src={session.user.image || ''}
                    alt="your profile"
                    referrerPolicy="no-referrer"
                    fill
                  />
                </div>

                <span className="sr-only">Your Profile</span>
                <div className="flex flex-1 flex-col">
                  <span aria-hidden="true">{session.user.name}</span>
                  <span aria-hidden="true" className="text-xs text-zinc-400">
                    {session.user.email}
                  </span>
                </div>

                <SignOutButton className="h-full aspect-square p-2" />
              </div>
            </li>
          </ul>
        </nav>
      </div>
      {children}
    </div>
  )
}

export default Layout
