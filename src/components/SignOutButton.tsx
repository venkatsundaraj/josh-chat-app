'use client'

import { ButtonHTMLAttributes, FC } from 'react'
import Button from './ui/Button'
import { signOut } from 'next-auth/react'
import React from 'react'
import toast from 'react-hot-toast'
import { Loader2, LogOut } from 'lucide-react'

interface SignOutButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

const SignOutButton: FC<SignOutButtonProps> = ({ children, ...props }) => {
  const [signingOut, setSigningOut] = React.useState<boolean>(false)

  const signOutHandler = async function () {
    setSigningOut(true)
    try {
      await signOut()
    } catch (err) {
      toast.error('There was a problem with signout button')
    } finally {
      setSigningOut(false)
    }
  }
  return (
    <Button {...props} variant="ghost" onClick={signOutHandler}>
      {signingOut ? <Loader2 className="animate-spin w-4 h-4" /> : <LogOut />}
    </Button>
  )
}

export default SignOutButton
