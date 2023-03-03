import UserProfileProps from '../type/UserProfileProps'
import { provider } from '../constants/constants'
import { useEffect, useState } from "react"
import { JsonRpcProvider, getObjectFields } from '@mysten/sui.js'
import Avatar from './Avatar'
import style from './styles/UserProfile.module.css'

const UserProfile = ({ loginInfo }: UserProfileProps) => {
    const [avatarUrl, setAvatarUrl] = useState<string>('')
    const [name, setName] = useState<string>('')

    const get_avatar_url = async (provider: JsonRpcProvider, loginInfo: string) => {
        const obj = await provider.getObject(loginInfo)
        const fields = getObjectFields(obj)
        return fields?.avatar_url
    }

    useEffect(() => {
        if (loginInfo === undefined) return

        get_avatar_url(provider, loginInfo).then(avatarUrl => setAvatarUrl(avatarUrl))

        setName(window.localStorage.getItem("name") || "")

    }, [loginInfo])


    return (
        <div className={style.profile}>
            <Avatar className={style.avatar} url={avatarUrl} />
            <span className={style.name}>{name}</span>
        </div>
    )
}

export default UserProfile