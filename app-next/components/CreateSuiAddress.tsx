import { Ed25519Keypair, Secp256k1Keypair, JsonRpcProvider, RawSigner, TypeTag, Network } from '@mysten/sui.js'
import { fromExportedKeypair, MoveEvent, ExportedKeypair } from "@mysten/sui.js"
import { useState, useEffect } from 'react'
import { generateKeyPair } from 'crypto'
import { TransferSuiTransaction } from '@mysten/sui.js/dist/signers/txn-data-serializers/txn-data-serializer'
import { provider, signer1, suiObjectId1, packageObjectId } from '../constants/constants'
import CreateSuiAddressProps from '../type/CreateSuiAddressProps'
import styles from './styles/Login.module.css'

const CreateSuiAddress = ({ component, setComponent, keypair, setKeypair, publicKey, setPublicKey, secretKey, setSecretKey, rawSigner, setRawSigner, address, setAddress, suiBalance, setSuiBalance }: CreateSuiAddressProps) => {
  // const [keypair, setKeypair] = useState<Ed25519Keypair>();
  // const [publicKey, setPublicKey] = useState<string>();
  // const [secretKey, setSecretKey] = useState<string>();
  // const [rawSigner, setRawSigner] = useState<RawSigner>();
  // const [address, setAddress] = useState<string>();
  // const [suiBalance, setSuiBalance] = useState<number>();
  const [displayKeys, setDisplayKeys] = useState<boolean>(false)

  const sui_to_mist = (sui: number): number => 1_000_000_000 * sui
  const mist_to_sui = (mist: number): number => mist / 1_000_000_000

  const generate_and_fund_keypair = async () => {
    setDisplayKeys(false)
    const keypair: Ed25519Keypair = Ed25519Keypair.generate()
    setKeypair(keypair)

    const publicKey: string = keypair.getPublicKey().toString()
    setPublicKey(publicKey)

    const secretKey: string = keypair.export().privateKey
    setSecretKey(secretKey)

    const rawSigner: RawSigner = new RawSigner(keypair, provider)
    setRawSigner(rawSigner)

    const address: string = await rawSigner.getAddress()
    setAddress(address)

    const txn: TransferSuiTransaction = {
      amount: sui_to_mist(0.0001),
      recipient: address,
      suiObjectId: suiObjectId1,
      gasBudget: 30000,
    }
    const response = await signer1.transferSui(txn)
    console.log(response)

    const getBalanceTxn = await provider.getBalance(address, "0x2::sui::SUI")
    const suiBalance = mist_to_sui(getBalanceTxn.totalBalance)
    console.log(getBalanceTxn)
    setSuiBalance(suiBalance)

    setDisplayKeys(true)

    // const response: any = await provider.requestSuiFromFaucet(address, header);
    // console.log(response);
  }

  async function login() {
    await generate_and_fund_keypair()
    setComponent("AvatarUpload")
  }

  return (
    <div className={styles.logBox}>
      <button onClick={login} disabled={displayKeys} className={styles.logButton}>Login</button>
      {displayKeys && (
        <div className={styles.userKey}>
          {/* <h3>Account creation successful, please take notes of the following information:</h3> */}
          {/* <p>public key: {publicKey}</p> */}
          <p>Please Save Your Private key:</p>
          <p>{secretKey}</p>
          {/* <p>address: {address}</p> */}
          {/* <p>balance: {suiBalance}</p> */}
          <button onClick={() => setComponent("AvatarUpload")} className={styles.logButton}>Next</button>
        </div>
      )}
    </div>
  )
}

export default CreateSuiAddress