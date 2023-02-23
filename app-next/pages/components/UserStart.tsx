import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import {Ed25519Keypair, Secp256k1Keypair, JsonRpcProvider, RawSigner, TypeTag, Network } from '@mysten/sui.js';
import {fromExportedKeypair,MoveEvent,ExportedKeypair} from "@mysten/sui.js";
import { useState, useEffect, useRef } from 'react';
import { generateKeyPair } from 'crypto';
import { TransferSuiTransaction } from '@mysten/sui.js/dist/signers/txn-data-serializers/txn-data-serializer';
import "bootstrap/dist/css/bootstrap.min.css";
import { provider, signer1, suiObjectId1, packageObjectId } from '../constants/constants';
import CreateSuiAddressProps from '../type/CreateSuiAddressProps';
import UserHomeProps from '../type/UserHomeProps';
import { NavItem } from './NavItem';
import UserProfile from './UserProfile';
import UserStartProps from '../type/UserStartProps';
import { addRequestMeta } from 'next/dist/server/request-meta';
import { getObjectFields } from '@mysten/sui.js';

const UserStart = ({loginInfo, address, avatarUrl}: UserStartProps) => {

    const inputRef = useRef<HTMLInputElement>(null);

    const [ sessionInfo, setSessionInfo ] = useState<{
        session_id: number,
        session_description: string,
        session_type: string,
        session_image_url: string,
        session_starter_address: string,
        session_participant_addresses: Array<string>,
        session_location_latitude: number,
        session_location_longitude: number,
        session_timestamp: number
    }>({
        session_id: 0,
        session_description: "",
        session_type: "",
        session_image_url: "",
        session_starter_address: "",
        session_participant_addresses: [address!],
        session_location_latitude: 0,
        session_location_longitude: 0,
        session_timestamp: 0
    });

    const mint = async (signer:any) =>{
        const {
            session_id,
            session_description,
            session_type,
            session_image_url,
            session_starter_address,
            session_participant_addresses,
            session_location_latitude,
            session_location_longitude,
            session_timestamp
        } = sessionInfo;
        const moveCallTxn = await signer.executeMoveCall({
            packageObjectId,
            module: 'nft_link',
            function: 'mint',
            typeArguments: [],
            arguments: [
                loginInfo,
                session_id,
                session_description,
                session_type,
                session_image_url,
                session_starter_address,
                session_participant_addresses,
                session_location_latitude,
                session_location_longitude,
                session_timestamp,
            ],
            gasBudget: 10000,
        });
        console.log(moveCallTxn);
    }

    const set_session_description = (sessionDescription: string) => {
        setSessionInfo({
            ...sessionInfo,
            session_description: sessionDescription,
        });
    }

    const add_session_participant_address = (sessionParticipantAddress: string) => {
        setSessionInfo({
            ...sessionInfo,
            session_participant_addresses: [...sessionInfo.session_participant_addresses, sessionParticipantAddress]
        });
    }

    // useEffect(() => {
    //     if(address) {
    //         add_session_participant_address(address);
    //     }
    // }, [])

    return(
        <div>
            {sessionInfo.session_description === "" ? (
                <div>
                    <input ref={inputRef}></input>
                    <button onClick={() => {
                        if(inputRef.current !== null) {
                            set_session_description(inputRef.current.value);
                        }
                    }}>
                        Start Event
                    </button>
                </div>
            ) : (
                sessionInfo.session_participant_addresses.map((address, index) => (
                    <div>
                        <div>{address}</div>
                        <img 
                            src={avatarUrl} // this is just user's own avatar, need to generalize to getting everyone's avatar using their address
                            alt="image"
                        />
                    </div>
                    )
                )
            )
            }
        </div>
    );
}

export default UserStart;

// <div>
// <input
//     placeholder="type in description for your event"
//     onChange={(e) => set_session_description(e.target.value)}
// />
// <button onClick={}>Start Event</button>
// </div>