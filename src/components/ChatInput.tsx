'use client'

import { FC, useRef, useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import Button from './ui/Button'
import axios from 'axios'

interface ChatInputProps {
  chatPartner: User
  chatId: string
}

const ChatInput: FC<ChatInputProps> = ({ chatPartner, chatId }) => {
  const [inputValue, setInputValue] = useState<string>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const textArea = useRef<HTMLTextAreaElement | null>(null)

  const sendMessage = async function () {
    setIsLoading(true)
    try {
      // await new Promise((resolve) => setTimeout(resolve, 2000))
      await axios.post('/api/message/send', { text: inputValue, chatId })
      setInputValue('')
      textArea.current?.focus()
    } catch (err) {
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className="border-t border-gray-400 px-4 py-4 mb-2 sm:mb-0">
      <div className="relative flex flex-1 overflow-hidden rounded-lg shadow-sm ring-inset ring-gray-300 focus-within:ring-2">
        <TextareaAutosize
          ref={textArea}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              sendMessage()
            }
          }}
          rows={1}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={`Chat Partner `}
          className="w-full resize-none border-0 shadow-sm  ring-offset-2 ring-2 bg-transparent text-gray-900 placeholder:text-zinc-600 py-4 px-2 ring-inset focus:ring-transparent "
        />
        <div
          className="py-2"
          aria-hidden="true"
          onClick={() => textArea.current?.focus}
        >
          <div className="py-px ">
            <div className="h-9" />
          </div>
        </div>
        <div className="absolute top-[46%] translate-y-[-50%] right-0 bottom-0 flex justify-between pl-3 pr-2">
          <div className="flex shrink-0">
            <Button
              onClick={sendMessage}
              variant="default"
              type="submit"
              isLoading={isLoading}
            >
              Post
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatInput
