'use client'

import { FC, useState } from 'react'
import Button from './ui/Button'
import axios, { AxiosError } from 'axios'
import { addFriendValidator } from '@/utils/validations/add-friend'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

interface AddFriendButtonProps {}

type FormData = z.infer<typeof addFriendValidator>

const AddFriendButton: FC<AddFriendButtonProps> = ({}) => {
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false)

  const {
    register,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(addFriendValidator),
  })
  const addFriend = async function (email: string) {
    try {
      const validateEmail = addFriendValidator.parse({ email })

      await axios.post('/api/friends/add', {
        email: validateEmail,
      })
      setShowSuccessMessage(true)
    } catch (err) {
      console.log(err)
      if (err instanceof z.ZodError) {
        setError('email', { message: err.message })
        return
      }
      if (err instanceof AxiosError) {
        setError('email', { message: err.response?.data })
        return
      }

      setError('email', { message: 'something went wrong' })
    }
  }

  const onSubmit = function (data: FormData) {
    addFriend(data.email)
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-screen h-48 gap-4 w-full flex flex-col items-center justify-between"
    >
      <h1 className="text-slate-900 font-bold text-3xl">Add a Friend</h1>
      <label
        htmlFor="email"
        className="block tex-gray-900 font-medium text-sm leading-6"
      >
        Add friend by email
      </label>
      <div className="flex items-center justify-start gap-3">
        <input
          {...register('email')}
          type="email"
          className="w-full block  py-1.5 px-1  focus:outline-none text-md ring-offset-2   rounded-md shadow-sm text-gray-900"
          placeholder="you@example.com"
        />
        <Button>Add</Button>
      </div>
      <p className="mt-1 text-red-500 block leading-6 tracking-normal">
        {errors.email?.message}
      </p>
      {showSuccessMessage ? (
        <p className="mt-1 text-green-500 block leading-6 tracking-tighter">
          Your Friend request send
        </p>
      ) : null}
    </form>
  )
}

export default AddFriendButton
