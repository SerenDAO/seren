/* a simple avatar component */
import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import AvatarProps from '@/type/AvatarProps'
import style from './styles/Avatar.module.css'
import { listeners } from 'process'

export default function Avatar({ className, url, width, height }: AvatarProps) {
  const ref = React.createRef<HTMLImageElement>()

  // prevent default behavior of image when touched
  useEffect(() => {
    const image = ref.current
    const listener = (e: TouchEvent) => {
      e.preventDefault()
    }
    if (image) {
      image.addEventListener('touchstart', listener)
    }
    return () => {
      if (image) {
        image.removeEventListener('touchstart', listener)
      }
    }
  }, [ref])

  return (
    <div className={(className || '') + ' ' + style.avatar}>
      <Image
        ref={ref}
        className={style.avatarImage}
        src={url}
        alt="image"
        width={width ?? 50}
        height={height ?? 50}
        onTouchStart={(e) => {
          e.preventDefault()
        }}
      />
    </div>
  )
}