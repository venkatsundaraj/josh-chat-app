import Link from 'next/link'
import { FC } from 'react'

interface pageProps {}

type User = {
  name: string
  email: string
  id: string
}
const Users = [
  { name: 'venkat', email: 'venkat@gmail.com', id: '1' },
  { name: 'sarathi', email: 'sarathi@gmail.com', id: '2' },
  { name: 'vimal', email: 'vimal@gmail.com', id: '3' },
] as User[]

const page: FC<pageProps> = ({}) => {
  return (
    <div className="flex flex-col space-y-3 items-center justify-start">
      <h1>Hello world</h1>
    </div>
  )
}

export default page
