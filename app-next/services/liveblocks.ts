import { createClient } from "@liveblocks/client"
import { createRoomContext } from "@liveblocks/react"

const client = createClient({
  publicApiKey: "pk_test_tf3-x-P8qPVTgXvcJllUaUjA",
})

export type Presence = {
  screenPosition: { x: number; y: number } | null,
  userInfo: { avatarUrl: string; name: string; address: string },
  enteredAt: number,
  pressing: boolean,
};

export const {
  RoomProvider,
  useOthers,
  useUpdateMyPresence,
} = createRoomContext<Presence>(client)