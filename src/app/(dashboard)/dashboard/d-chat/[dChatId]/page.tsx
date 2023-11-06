import { FC } from 'react'

interface pageProps {
  params: {
    dChatId: string
  }
}

const page: FC<pageProps> = ({ params }) => {
  const { dChatId } = params
  return <div>{dChatId}</div>
}

export default page
