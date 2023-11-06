import clsx, { ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = function (...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const chatIdsConstructor = function (id1: string, id2: string) {
  const sortedIds = [id1, id2].sort()

  return `${sortedIds[0]}--${sortedIds[1]}`
}

export const toPusherKey = function (key: string) {
  return key.replace(/:/g, '__')
}
