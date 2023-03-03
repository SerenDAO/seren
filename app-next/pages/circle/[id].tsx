import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Avatar from '@/components/Avatar'
import CircleRoomProps from '@/type/CircleRoomProps'
import style from '../../styles/Circle.module.css'
import plusImage from '../../public/plus.svg'

export default function CircleRoom(props: CircleRoomProps) {
  const [avatarUrl, setAvatarUrl] = useState<string>('')
  const [avatarFrienUrl, setAvatarFriendUrl] = useState<string>('')

  useEffect(() => {
    if (window && window.localStorage) {
      const avatarUrlFromStorage = window.localStorage.getItem('avatarUrl')
      if (avatarUrlFromStorage) {
        setAvatarUrl(avatarUrlFromStorage)
      }
    }
  }, [])

  return <div className={style.circleEvent}>
    <div className={style.tunnel}></div>
    <Avatar
      className={style.avatar + ' ' + style.avatarMe}
      url={avatarUrl || '/avatar.png'}
    />
    {avatarFrienUrl ?
      <Avatar
        className={style.avatarFriend + ' ' + style.avatar}
        url={avatarUrl || '/avatar.png'}
      />
      : <div className={style.avatarFriendPlus}>
        <Image src={plusImage} width={100} height={100} alt="invite friends" />
      </div>
    }
  </div>
}