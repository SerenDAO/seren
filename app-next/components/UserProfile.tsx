import UserProfileProps from '../type/UserProfileProps'
import { Ed25519Keypair, Secp256k1Keypair, JsonRpcProvider, RawSigner, TypeTag, Network } from '@mysten/sui.js'
import { provider, signer1, suiObjectId1, packageObjectId } from '../constants/constants'
import { useState } from "react"

const UserProfile = ({ loginInfo }: UserProfileProps) => {

    const get_mint_event_data = async (provider: JsonRpcProvider) => {
        const mintEvent = await provider.getEvents(
            { "MoveEvent": packageObjectId + "::nft_link::MintNFTLinkEvent" },
            null,
            null,
            "ascending"
        )
        const out: any = []
        for (let i = 0; i < mintEvent.data.length; i++) {
            let eventData: any = mintEvent.data[i].event
            out.push(eventData.moveEvent)
        }
        console.log(out)
        return out
    }

    return (
        <div>

        </div>
    )
}

export default UserProfile