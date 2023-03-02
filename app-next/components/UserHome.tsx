import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import { Ed25519Keypair, Secp256k1Keypair, JsonRpcProvider, RawSigner, TypeTag, Network } from '@mysten/sui.js'
import { fromExportedKeypair, MoveEvent, ExportedKeypair } from "@mysten/sui.js"
import { useState, useEffect } from 'react'
import { generateKeyPair } from 'crypto'
import { TransferSuiTransaction } from '@mysten/sui.js/dist/signers/txn-data-serializers/txn-data-serializer'
import { provider, signer1, suiObjectId1, packageObjectId } from '../constants/constants'
import CreateSuiAddressProps from '../type/CreateSuiAddressProps'
import UserHomeProps from '../type/UserHomeProps'
import { NavItem } from './NavItem'
import UserProfile from './UserProfile'
import UserStart from './UserStart'
import { getObjectFields } from '@mysten/sui.js'

const UserHome = ({ loginInfo, setLoginInfo, address }: UserHomeProps) => {

    const [userComponent, setUserComponent] = useState<string>("UserStart")
    const [avatarUrl, setAvatarUrl] = useState<string>("")

    const get_avatar_url = async (provider: JsonRpcProvider, loginInfo: string) => {
        const obj = await provider.getObject(loginInfo)
        const fields = getObjectFields(obj)
        if (fields !== undefined) {
            setAvatarUrl(fields.avatar_url)
        }
    }

    useEffect(() => {
        if (loginInfo !== undefined) {
            get_avatar_url(provider, loginInfo)
        }
    }, [loginInfo])

    return (
        <div className="profile-page">
            <span>
                <button>Profile</button>
                <button>Collection</button>
                <button>Start</button>
            </span>

            {userComponent === "UserProfile" && <UserProfile loginInfo={loginInfo} />}

            {userComponent === "UserCollection" && <></>}

            {userComponent === "UserStart" && <UserStart address={address} loginInfo={loginInfo} avatarUrl={avatarUrl} />}
            {/* 
            <Image src="/circle.png" alt='seren circle' width='100'
                height={100} /> */}
        </div>
    )
}

export default UserHome

// {/* <nav className="navbar py-4 px-4 bg-base-100">
//             <div className="flex-1">
//                 {/* <a href="http://movedid.build" target="_blank">
//                 <Image src="/logo.png" width={64} height={64} alt="logo" />
//                 </a> */}
//                 <ul className="menu menu-horizontal p-0 ml-5">
//                     <NavItem href="/" title="Coin Airdropper" />
//                     <NavItem href="/nft_airdropper" title="NFT Airdropper" />
//                     <NavItem href="/get_airdrop_addresses" title="Get Airdrop Addresses" />
//                     {/* <li className="font-sans font-semibold text-lg">
//                         <a href="https://github.com/NonceGeek/Airdropper-Based-On-Github" target="_blank">Source Code</a>
//                         <a href={MODULE_URL} target="_blank">Contract on Explorer</a>
//                     </li> */}
//                     <NavItem href="/other_utils" title="Other Utils" />
//                 </ul>
//             </div>
//         </nav> */}