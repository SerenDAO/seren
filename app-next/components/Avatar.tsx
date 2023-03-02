/* a simple avatar component */
import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import AvatarProps from '@/type/AvatarProps'

export default function Avatar({ url, width, height }: AvatarProps) {
  return (
    <div className='avatar'>
      <Image
        className='avatar-image'
        src={url}
        alt="image"
        width={width ?? 50}
        height={height ?? 50}
      />
    </div>
  )
}