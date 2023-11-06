'use client'

import React, { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import { signIn } from 'next-auth/react'
import { toast } from 'react-hot-toast'

function Login() {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    console.log(toast)
    toast('hello')
  }, [])

  const loginHandler = async () => {
    setIsLoading(true)
    try {
      await signIn('google')
    } catch (err) {
      console.log(err)
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <section className="min-w-screen min-h-screen flex items-start justify-center ">
      <div className="max-w-md xl:max-w-2xl rounded-lg flex flex-col items-center justify-center px-2 py-4 gap-14">
        <div className="flex flex-col w-full min-h-fit items-center justify-center gap-10">
          <h1>Logo</h1>
          <h2 className="text-3xl tracking-tighter">Sign in to your account</h2>
        </div>
        <Button
          type="button"
          onClick={loginHandler}
          isLoading={isLoading}
          className="w-full h-auto max-w-sm gap-4"
        >
          {isLoading ? null : (
            <>
              <svg
                className="h-4 w-4 m-0"
                aria-hidden="true"
                focusable="false"
                data-prefix="fab"
                data-icon="github"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
                <path d="M1 1h22v22H1z" fill="none" />
              </svg>
            </>
          )}
          <span className="text-slate-300">Google</span>
        </Button>
      </div>
    </section>
  )
}

export default Login
