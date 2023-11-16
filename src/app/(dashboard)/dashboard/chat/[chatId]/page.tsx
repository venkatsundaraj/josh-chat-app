import ChatInput from '@/components/ChatInput'
import Messages from '@/components/Messages'
import { fetchRedis } from '@/helpers/redis'
import { authOptions } from '@/utils/auth'
import { messageArrayValidator } from '@/utils/validations/message'
import { getServerSession } from 'next-auth'
import Image from 'next/image'
import { notFound } from 'next/navigation'

interface pageProps {
  params: {
    chatId: string
  }
}

const getChatMessages = async function (chatId: string) {
  try {
    const results: string[] = await fetchRedis(
      'zrange',
      `chat:${chatId}:messages`,
      0,
      -1
    )

    const dbMessages = results.map((message) => JSON.parse(message) as Message)

    const reversedDbMessages = dbMessages.reverse()

    const messages = messageArrayValidator.parse(reversedDbMessages)

    return messages
  } catch (err) {
    notFound()
  }
}

const page = async ({ params }: pageProps) => {
  const session = await getServerSession(authOptions)

  if (!session) notFound()

  const { user } = session

  const [user1, user2] = params.chatId.split('--')

  if (user.id !== user1 && user.id !== user2) {
    return notFound()
  }

  const chatPartnerId = user.id === user1 ? user2 : user1

  // const chatPartner = await db.get(`user:${chatPartnerId}`) as User | null
  const chatPartner = await fetchRedis('get', `user:${chatPartnerId}`)

  const parsedChatPartner = JSON.parse(chatPartner) as User

  const initialMessages = await getChatMessages(params.chatId)

  return (
    <div className="flex flex-1 flex-col justify-between h-full max-h-[calc(100vh - 6rem)]">
      <div className="flex items-center justify-between border-b-2 border-gray-200 py-3">
        <div className="relative flex items-center space-x-4">
          <div className="relative  flex items-center space-x-2">
            <div className="relative">
              <div className="relative w-8 h-8 sm:w-12 sm:h-12">
                <Image
                  fill
                  referrerPolicy="no-referrer"
                  alt={`${parsedChatPartner.name} profile picture`}
                  src={parsedChatPartner.image}
                  className="rounded-full"
                />
              </div>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-violet-700 text-xl items-center">
                {parsedChatPartner.name}
              </span>
              <span className="text-gray-700 text-sm items-center">
                {parsedChatPartner.email}
              </span>
            </div>
          </div>
        </div>
      </div>
      <Messages
        chatPartner={parsedChatPartner}
        sessionImage={session.user.image}
        initialMessages={initialMessages}
        sessionId={session.user.id}
        chatId={params.chatId}
      />
      <ChatInput chatId={params.chatId} chatPartner={parsedChatPartner} />
    </div>
  )
}

export default page
