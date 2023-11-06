import { fetchRedis } from './redis'

export const getFriendsByUserId = async function (userId: string) {
  const friendIds = (await fetchRedis(
    'smembers',
    `user:${userId}:friends`
  )) as string[]

  const friendProfiles = await Promise.all(
    friendIds.map(async function (id) {
      const friend = (await fetchRedis('get', `user:${id}`)) as string

      const parsedFriend = JSON.parse(friend) as User

      return parsedFriend
    })
  )

  return friendProfiles
}
