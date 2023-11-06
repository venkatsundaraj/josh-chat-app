import React from 'react'
import { FC } from 'react'
import Button from '@/components/ui/Button'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/utils/auth'
import Input from '@/components/ui/Input'

type PageProps = {}

const Dashboard: FC<PageProps> = async function () {
  const session = await getServerSession(authOptions)
  return (
    <>
      <h2 className="text-orange-500 leading-6 block">{session?.user.email}</h2>
      {/* <Input variant="dark" type="text" /> */}
    </>
  )
}

export default Dashboard
