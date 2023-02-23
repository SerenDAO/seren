import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import {Ed25519Keypair, Secp256k1Keypair, JsonRpcProvider, RawSigner, TypeTag, Network } from '@mysten/sui.js';
import {fromExportedKeypair,MoveEvent,ExportedKeypair} from "@mysten/sui.js";
import { useState, useEffect } from 'react';
import { generateKeyPair } from 'crypto';
import { TransferSuiTransaction } from '@mysten/sui.js/dist/signers/txn-data-serializers/txn-data-serializer';
import "bootstrap/dist/css/bootstrap.min.css";
import { provider, signer1, suiObjectId1, packageObjectId } from '../constants/constants';
import CreateSuiAddressProps from '../type/CreateSuiAddressProps';
import UserHomeProps from '../type/UserHomeProps';
import { NavItem } from './NavItem';

const UserHome = ({loginInfo, setLoginInfo}: UserHomeProps) => {
    
    useEffect(() => {
        console.log(loginInfo)
    }, [])

    return (
        <div>
            <span>
                <button>Profile</button>
                <button>Collection</button>
                <button>Create Your Seren</button>
            </span>
        </div>
    );
}

export default UserHome;

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