import {Ed25519Keypair, Secp256k1Keypair, JsonRpcProvider, RawSigner, TypeTag, Network } from '@mysten/sui.js';

export default interface AvatarUploadProps {
    component: string,
    setComponent: (component: string) => void,
    rawSigner: RawSigner | undefined,
    loginInfo: string | undefined,
    setLoginInfo: (loginInfo: string) => void
}