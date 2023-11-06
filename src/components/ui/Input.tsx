import { FC } from 'react'
import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'
import { cva, VariantProps } from 'class-variance-authority'
import { ClassValue } from 'clsx'

const inputVariants = cva(
  'border-none outline-none ring  rounded-md w-auto h-6',
  {
    variants: {
      variant: {
        default: 'focus:ring-green-200 focus:ring-offset-3 bg-green-400',
        dark: 'focus:ring-slate-200 focus:ring-offset-3 bg-slate-400',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

const cn = function (...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {}

const Input: FC<InputProps> = ({ variant, ...props }) => {
  const allowed: boolean = true
  return <input {...props} className={cn(inputVariants({ variant }))} />
}

export default Input
