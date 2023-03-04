import React, { useCallback, useEffect, useState } from "react"
import Image from 'next/image'
import { useUpdateMyPresence, useOthers, Presence } from '../services/liveblocks'
import Avatar from './Avatar'
import plusImage from '../public/plus.svg'
import style from '../styles/Circle.module.css'

export function EventStart() {
  const others = useOthers()
  const [avatarUrl, setAvatarUrl] = useState<string>('')
  const [avatarFriendUrl, setAvatarFriendUrl] = useState<string>('')
  const [userInfo, setUserInfo] = useState<Presence['userInfo'] | null>(null)
  const updateMyPresence = useUpdateMyPresence()
  const [enteredAt, setEnteredAt] = useState<number>(0)
  const [myAvatarPressing, setMyAvatarPressing] = useState<boolean>(false)
  const [friendAvatarPressing, setFriendAvatarPressing] = useState<boolean>(false)

  useEffect(() => {
    if (window && window.localStorage) {
      const avatarUrlFromStorage = window.localStorage.getItem('avatarUrl')
      if (avatarUrlFromStorage) {
        setAvatarUrl(avatarUrlFromStorage)
      }

      const nameFromStorage = window.localStorage.getItem('name')
      const addressFromStorage = window.localStorage.getItem('address')
      if (avatarUrlFromStorage && nameFromStorage && addressFromStorage) {
        const userInfo = {
          avatarUrl: avatarUrlFromStorage,
          name: nameFromStorage,
          address: addressFromStorage
        }
        setUserInfo(userInfo)

        const enteredAt = new Date().getTime()
        setEnteredAt(enteredAt)
        updateMyPresence({
          screenPosition: null,
          userInfo: userInfo,
          enteredAt: enteredAt,
          pressing: false
        })
      } else {
        localStorage.setItem('redirect', window.location.href)
        window.location.href = '/'
      }
    }
  }, [])


  function share() {
    if (navigator.share) {
      // Web Share API is supported
      navigator.share({ text: window.location.href })
    } else {
      // Fallback
      alert('Please copy the current page link and share it with your friends.')
    }
  }

  // Get the next friend if the friend's enteredAt is the closest
  // to the current user
  const getNextFriend = useCallback((): Presence | null => {
    let nextFriend = null
    let firstFriend: Presence | null = null
    // 20 mins later
    const initEnteredAt = new Date().getTime() + 20 * 60 * 1000
    let tmpEnteredAt = initEnteredAt

    if (enteredAt === 0 || others.length <= 0) return null
    console.log('enteredAt', enteredAt)
    // TODO test this
    others.forEach(({ presence }) => {
      if (firstFriend === null || presence.enteredAt < firstFriend.enteredAt) {
        firstFriend = presence
      }
      if (presence.enteredAt > enteredAt && presence.enteredAt < tmpEnteredAt) {
        tmpEnteredAt = presence.enteredAt
        nextFriend = presence
      }
    })
    return nextFriend || firstFriend
  }, [enteredAt, others])

  useEffect(() => {
    if (others.length > 0) {
      const nextFriend = getNextFriend()
      console.log('others', others)
      console.log('nextFriend entered', nextFriend?.userInfo.name, nextFriend?.enteredAt)
      if (nextFriend) {
        console.log('nextFriend', nextFriend)
        setAvatarFriendUrl(nextFriend.userInfo.avatarUrl)
      }
    }
  }, [getNextFriend, others.length])

  const canMint = useCallback(() => {
    // check others are pressing
    if (others.length <= 0) return false
    let othersPressing = true
    others.forEach(({ presence }) => {
      if (!presence.pressing) othersPressing = false
    })
    // TODO check every avatar of each device is pressing
    return myAvatarPressing && friendAvatarPressing && othersPressing
  }, [myAvatarPressing, friendAvatarPressing])


  return <>{userInfo && <>
    <div className={style.tunnel}></div>
    <div
      onTouchStart={(e) => {
        setEnteredAt(enteredAt)
        console.log(e.touches[0].clientX, e.touches[0].clientY)
        updateMyPresence({
          screenPosition: { x: e.touches[0].clientX, y: e.touches[0].clientY },
          userInfo: userInfo!,
          enteredAt: enteredAt,
          pressing: true
        })
        setMyAvatarPressing(true)
      }}
      onTouchEnd={() => {
        setMyAvatarPressing(false)
        updateMyPresence({
          pressing: false
        })
      }}>
      <Avatar
        className={style.avatar + ' ' + style.avatarMe}
        url={avatarUrl || '/avatar.png'}
      />
    </div>
    {
      avatarFriendUrl ?
        <div
          onTouchStart={(e) => {
            setFriendAvatarPressing(true)
            if (canMint()) {
              console.log('mint')
            }
          }}
          onTouchEnd={() => {
            setFriendAvatarPressing(false)
          }}
        ><Avatar
            className={style.avatarFriend + ' ' + style.avatar}
            url={avatarFriendUrl || '/avatar.png'}
          /></div>
        : <div className={style.avatarFriendPlus} onClick={share}>
          <Image src={plusImage} width={100} height={100} alt="invite friends" />
        </div>
    }

    <div className='others' style={{
      position: 'absolute',
      top: '1em',
      left: '1em',
    }}>
      {others.map(({ connectionId, presence }) => {
        if (presence.userInfo) {
          return <Avatar
            className={style.avatarOther + ' ' + style.avatar}
            key={connectionId}
            url={presence.userInfo.avatarUrl}
          />
        }
      })}
    </div>
  </>
  }
  </>
}