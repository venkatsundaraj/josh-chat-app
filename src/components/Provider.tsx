import React from 'react'
import { Toaster } from 'react-hot-toast'

interface ProviderProps {
  children: React.ReactNode
}

const Provider: React.FC<ProviderProps> = function ({ children }) {
  return (
    <>
      <Toaster position="bottom-center" reverseOrder={false} />
      {children}
    </>
  )
}

export default Provider
