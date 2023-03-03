import { Ed25519Keypair, RawSigner } from '@mysten/sui.js'
import "bootstrap/dist/css/bootstrap.min.css"

export default interface CreateSuiAddressProps {
    component: string,
    setComponent: (component: string) => void,
    keypair: Ed25519Keypair | undefined,
    setKeypair: (keypair: Ed25519Keypair) => void,
    publicKey: string | undefined,
    setPublicKey: (publicKey: string) => void,
    secretKey: string | undefined,
    setSecretKey: (secretKey: string) => void,
    rawSigner: RawSigner | undefined,
    setRawSigner: (rawSigner: RawSigner) => void,
    address: string | undefined,
    setAddress: (address: string) => void,
    suiBalance: number | undefined,
    setSuiBalance: (suiBalance: number) => void,
}