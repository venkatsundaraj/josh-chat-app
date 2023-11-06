import { z } from 'zod'

export const messageValidataion = z.object({
  id: z.string(),
  text: z.string().max(2000),
  senderId: z.string(),
  receiverId: z.string(),
  timeStamps: z.number(),
})

export const messageArrayValidator = z.array(messageValidataion)

export type Message = z.infer<typeof messageValidataion>
