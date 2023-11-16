import { authOptions } from '@/utils/auth'
import { getServerSession } from 'next-auth'
import { FC } from 'react'

type PageProps = {}

const Dashboard: FC<PageProps> = async function () {
  const session = await getServerSession(authOptions)
  return (
    <>
      <h2 className="text-orange-500 leading-6 block">
        {session?.user.email}</h2>
      {/* <Input variant="dark" type="text" />
       */}
    </>
  )
}

export default Dashboard
