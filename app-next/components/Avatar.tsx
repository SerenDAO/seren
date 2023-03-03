/* a simple avatar component */
import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import AvatarProps from '@/type/AvatarProps'
import style from './styles/Avatar.module.css'

export default function Avatar({ className, url, width, height }: AvatarProps) {
  return (
    <div className={className + ' ' + style.avatar}>
      <Image
        className={style.avatarImage}
        src={url}
        alt="image"
        width={width ?? 50}
        height={height ?? 50}
      />
    </div>
  )
}