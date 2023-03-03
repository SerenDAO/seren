import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import { Ed25519Keypair, Secp256k1Keypair, JsonRpcProvider, RawSigner, TypeTag, Network } from '@mysten/sui.js'
import { fromExportedKeypair, MoveEvent, ExportedKeypair } from "@mysten/sui.js"
import { useState, useEffect, useRef } from 'react'
import { generateKeyPair } from 'crypto'
import { TransferSuiTransaction } from '@mysten/sui.js/dist/signers/txn-data-serializers/txn-data-serializer'
import { provider, signer1, suiObjectId1, packageObjectId } from '../constants/constants'
import CreateSuiAddressProps from '../type/CreateSuiAddressProps'
import UserHomeProps from '../type/UserHomeProps'
import { NavItem } from './NavItem'
import UserProfile from './UserProfile'
import UserStartProps from '../type/UserStartProps'
import { addRequestMeta } from 'next/dist/server/request-meta'
import { getObjectFields } from '@mysten/sui.js'

const EventStart = ({ loginInfo, address, avatarUrl }: UserStartProps) => {

    const sessionDescriptionRef = useRef<HTMLInputElement>(null)
    const sessionNewParticipantAddressRef = useRef<HTMLInputElement>(null)

    const [sessionInfo, setSessionInfo] = useState<{
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
        session_id: 1, // default to 1 for now; will obtain from backend later
        session_description: "",
        session_type: "link", // default to link event for now; more event types to be added later
        session_image_url: "",
        session_starter_address: address!,
        session_participant_addresses: [],
        session_location_latitude: 0,
        session_location_longitude: 0,
        session_timestamp: 0
    })

    const mist_to_sui = (mist: number): number => mist / 1_000_000_000

    const mint = async (signer: any) => {
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
        } = sessionInfo
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
        })
        console.log(moveCallTxn)
    }

    const set_session_location_and_timestamp = () => {
        navigator.geolocation.getCurrentPosition(
            (data) => {
                setSessionInfo({
                    ...sessionInfo,
                    session_location_latitude: data.coords.latitude,
                    session_location_longitude: data.coords.longitude,
                    session_timestamp: data.timestamp
                })
            }
        )
    }

    const set_session_image_url = () => {

    }

    const set_session_description = (sessionDescription: string) => {
        setSessionInfo({
            ...sessionInfo,
            session_description: sessionDescription,
        })
    }

    const address_added_already = (sessionParticipantAddress: string): boolean => {
        if (sessionParticipantAddress === sessionInfo.session_starter_address) return true
        for (let i = 0; i < sessionInfo.session_participant_addresses.length; i++) {
            if (sessionInfo.session_participant_addresses[i] === sessionParticipantAddress) {
                return true
            }
        }
        return false
    }

    const add_session_participant_address = async (sessionParticipantAddress: string) => {
        try {
            const getBalanceTxn = await provider.getBalance(sessionParticipantAddress, "0x2::sui::SUI")
            const suiBalance = mist_to_sui(getBalanceTxn.totalBalance)
            console.log(getBalanceTxn)
            if (suiBalance < 0.00001) {
                alert("Participant does not have enough SUI (>=0.00001) to join the session and mint NFT!")
            } else if (address_added_already(sessionParticipantAddress)) {
                alert("Address added already!")
            } else {
                setSessionInfo({
                    ...sessionInfo,
                    session_participant_addresses: [...sessionInfo.session_participant_addresses, sessionParticipantAddress]
                })
            }
        } catch (error) {
            console.log(error)
            alert("Not valid address!")
        }
    }

    const remove_session_particpant_address = (sessionParticipantAddress: string) => {
        setSessionInfo({
            ...sessionInfo,
            session_participant_addresses: sessionInfo.session_participant_addresses.filter((address) => address !== sessionParticipantAddress)
        })
    }

    const render_session_info = () => {
        return (
            <>
                <p>{"ID: " + sessionInfo.session_id}</p>
                <p>{"Description: " + sessionInfo.session_description}</p>
                <p>{"Type: " + sessionInfo.session_type}</p>
                <p>{"Image URL: " + sessionInfo.session_image_url}</p>
                <p>{"Starter address: " + sessionInfo.session_starter_address}</p>
                <p>{"Latitude: " + sessionInfo.session_location_latitude}</p>
                <p>{"Longitude: " + sessionInfo.session_location_longitude}</p>
                <p>{"Timestamp: " + new Date(sessionInfo.session_timestamp).toLocaleString()}</p>
                <button onClick={() => set_session_location_and_timestamp()}>Refresh Location and Timestamp</button>
                <br /><br />
                {sessionInfo.session_participant_addresses.map((address, index) => {
                    return (
                        <span key={index}>
                            <p>{"Participant address " + (index + 1) + ": " + address}</p>
                            <button onClick={() => remove_session_particpant_address(address)}>Remove Participant</button>
                        </span>
                    )
                })}
                <br />
            </>
        )
    }



    // useEffect(() => {
    //     if(address) {
    //         add_session_participant_address(address);
    //     }
    // }, [])

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { set_session_location_and_timestamp() }, [sessionInfo.session_description]) // can't be put directly below "set_session_description" due to how useState refreshes

    return (
        <div>
            {sessionInfo.session_description === "" ? (
                <div>
                    <input ref={sessionDescriptionRef} placeholder="input event description"></input>
                    <button onClick={() => {
                        if (sessionDescriptionRef.current !== null) {
                            set_session_description(sessionDescriptionRef.current.value)
                        };
                    }}>
                        Start Event
                    </button>
                </div>
            ) : (
                <div>
                    {render_session_info()}
                    <input ref={sessionNewParticipantAddressRef} placeholder="add participant"></input>
                    <button onClick={() => {
                        if (sessionNewParticipantAddressRef.current !== null) {
                            add_session_participant_address(sessionNewParticipantAddressRef.current.value)
                        }
                    }}>
                        Add Participant
                    </button>

                </div>

                // sessionInfo.session_participant_addresses.map((address, index) => (
                //     <div key={index}>
                //         <div>{address}</div>
                //         <Image
                //             src={avatarUrl} // this is just user's own avatar, need to generalize to getting everyone's avatar using their address
                //             alt="image"
                //         />
                //     </div>
                // )
                // )
            )
            }
        </div>
    )
}

export default EventStart

// <div>
// <input
//     placeholder="type in description for your event"
//     onChange={(e) => set_session_description(e.target.value)}
// />
// <button onClick={}>Start Event</button>
// </div>