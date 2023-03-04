"use client"
import React, { useEffect, useState } from 'react'
import CircleRoomProps from '@/type/CircleRoomProps'
import style from '../../styles/Circle.module.css'
import { RoomProvider } from '../../services/liveblocks'
import { EventStart } from '@/components/EventStart'

export default function CircleRoom(props: CircleRoomProps) {
  const [roomID, setRoomID] = useState<string>('')

  useEffect(() => {
    setRoomID(global.location.pathname.slice(1))
  }, [])

  return <div className={style.circleEvent}>
    {roomID &&
      <RoomProvider id={roomID} initialPresence={{ screenPosition: null }}>
        <EventStart />
      </RoomProvider>
    }
  </div>
}