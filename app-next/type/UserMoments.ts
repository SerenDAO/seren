export default interface UserMoments {
  description: string,
  timestamp: number,
  participants: {
    address: string,
    name: string,
    avatar: string,
  }[],
}