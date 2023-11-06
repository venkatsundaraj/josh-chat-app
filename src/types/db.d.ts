interface User {
  name: string
  email: string
  id: string
  image: string
}

interface Message {
  id: string
  senderId: string
  receiverId: string
  text: string
  timeStamps: number
}

interface Chat {
  id: string
  message: Message[]
}

interface FriendRequest {
  id: string
  senderId: string
  receiverId: string
}
