import { Ed25519Keypair, Secp256k1Keypair, JsonRpcProvider, RawSigner, TypeTag, Network } from '@mysten/sui.js'
import { provider, signer1, suiObjectId1, packageObjectId } from '../constants/constants'
import { useEffect, useState } from "react"
import style from './styles/UserMoments.module.css'

const UserMoments = () => {

    const [moments, setMoments] = useState<any>([])

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

    useEffect(() => {
        get_mint_event_data(provider).then(moments => setMoments(moments))
    }, [])


    return (
        <div className={style.moments}>

        </div>
    )
}

export default UserMoments