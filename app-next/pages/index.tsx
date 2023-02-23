import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import {Ed25519Keypair, Secp256k1Keypair, JsonRpcProvider, RawSigner, TypeTag, Network } from '@mysten/sui.js';
import {fromExportedKeypair,MoveEvent,ExportedKeypair} from "@mysten/sui.js";
import { useState, useEffect } from 'react';
import { generateKeyPair } from 'crypto';
import { TransferSuiTransaction } from '@mysten/sui.js/dist/signers/txn-data-serializers/txn-data-serializer';
import { constants } from 'buffer';
import axios from 'axios';
// import fs from 'fs';
import FormData from 'form-data';


const provider = new JsonRpcProvider(Network.DEVNET);

const schema = new Ed25519Keypair().getKeyScheme();
const private_key1 = 'c8cJIQOtx55JUNrT0VAGd43cEvscqnO+u4clcXickSlg+Q1PFrl1qKuBlKU0/7KA62GPNDL2++KaFMjHFfZKfg==';
const private_key2 = 'Ypuiv4wJk7N6z7iVWt41F/94FEHQebE95uGqp8/5XjNhcRPZkJzlIqlE0R7Y/iLFwOiTRAh3eiescM6m0LwyIA==';
const key_pair_struct1:ExportedKeypair = {
    schema,
    privateKey:private_key1
}
const key_pair_struct2:ExportedKeypair = {
    schema,
    privateKey:private_key2
}
const keypair1 = fromExportedKeypair(key_pair_struct1);
const keypair2 = fromExportedKeypair(key_pair_struct2);

const signer1 = new RawSigner(keypair1, provider);
const signer2 = new RawSigner(keypair2, provider);

const suiObjectId1 = "0x08a6f17aad055bb78f4cff3b125f3ff6b4264d58";

const testAddress1 = '0xb9c39335bacc416fa067aacc1c775435c7d53179';
const testAddress2 = '0x0895e19842c2a081b161f685aa2f3b816ceb50ed';
const testAddress3 = '0xa9bb5225de506ba7b77f396f481d626a6cdbed9c';

const packageObjectId = '0x65136eef63a0217c7cd4ffc2b09bfcf1c463a33b';

export default function Home() {
  const [keypair, setKeypair] = useState<Ed25519Keypair>();
  const [publicKey, setPublicKey] = useState<string>();
  const [secretKey, setSecretKey] = useState<string>();
  const [rawSigner, setRawSigner] = useState<RawSigner>();
  const [address, setAddress] = useState<string>();
  const [suiBalance, setSuiBalance] = useState<number>();

  const sui_to_mist = (sui: number): number => 1_000_000_000 * sui;
  const mist_to_sui = (mist: number): number => mist / 1_000_000_000;

  const generate_and_fund_keypair = async () => {
    const keypair: Ed25519Keypair = Ed25519Keypair.generate();
    setKeypair(keypair);
    
    const publicKey: string = keypair.getPublicKey().toString();
    setPublicKey(publicKey);

    const secretKey: string = keypair.export().privateKey;
    setSecretKey(secretKey);

    const rawSigner: RawSigner = new RawSigner(keypair, provider);
    setRawSigner(rawSigner);

    const address: string = await rawSigner.getAddress();
    setAddress(address);

    const txn: TransferSuiTransaction = {
      amount: sui_to_mist(0.00001),
      recipient: address,
      suiObjectId: suiObjectId1,
      gasBudget: 30000,
    }
    const response = await signer1.transferSui(txn);
    console.log(response);

    const getBalanceTxn = await provider.getBalance(address, "0x2::sui::SUI");
    const suiBalance = mist_to_sui(getBalanceTxn.totalBalance);
    console.log(getBalanceTxn);
    setSuiBalance(suiBalance);

    // const response: any = await provider.requestSuiFromFaucet(address, header);
    // console.log(response);
  }

  const create_login_info = async(signer: RawSigner, avatarUrl: string) => {
    const moveCallTxn = await signer.executeMoveCall({
        packageObjectId,
        module: 'login_info',
        function: 'create_login_info',
        typeArguments: [],
        arguments: [
          avatarUrl
        ],
        gasBudget: 10000,
    });
    console.log(moveCallTxn);
  }

  const upload_avatar = async() => {
    // const axiosInstance = axios.create({
    //   baseURL: "https://ipfs.infura.io:5001/api/v0/add?",
    //   timeout: 3000,
    //   headers: {"Content-Type": "multipart/form-data"},
    // })
    const form = new FormData();
    form.append('file', fs.readFileSync('/sample-result.json'), '/sample-result.json');

    const response = await axios.post(
      'https://ipfs.infura.io:5001/api/v0/add',
      form,
      {
        params: {
            'pin': 'false'
        },
        headers: {
          ...form.getHeaders(),
          'Content-Type': 'multipart/form-data'
        },
        auth: {
          username: 'PROJECT_ID',
          password: 'PROJECT_SECRET'
          }
      }
    );
  }

  return (
    <div>
      <button onClick={generate_and_fund_keypair}>Create Account</button>
      <p>{publicKey}</p>
      <p>{secretKey}</p>
      <p>{address}</p>
      <p>balance: {suiBalance}</p>
    </div>
  );
}


// async function requestSuiFromFaucet(proxy: any, endpoint: string, recipient: string, httpHeaders: object) {
//   const res = await fetch2(endpoint, {
//     method: "POST",
//     agent: proxy,
//     body: JSON.stringify({
//       FixedAmountRequest: {
//         recipient
//       }
//     }),
//     headers: {
//       "Content-Type": "application/json",
//       ...httpHeaders || {}
//     }
//   });
//   console.log(res);
//   const parsed = await res.json();
//   console.log(parsed);
//   return parsed;
// }


// // connect to Devnet
// const provider = new JsonRpcProvider("DEVNET");
// provider.endpoints = {
//   fullNode: "https://fullnode.testnet.sui.io/",
//   faucet: "https://faucet.testnet.sui.io/gas",
// };

// /* const mn = bip39.generateMnemonic(wordlist);
// console.log(mn); */
// //let a = bip39.mnemonicToSeedSync(mn, "!woaini521");

// let headers = {
//   "Content-Type": "application/json",
//   cookie:
//     '_ga=GA1.1.1084650234.1666890693; sui_io_cookie={"level":["necessary","analytics"],"revision":0,"data":null,"rfc_cookie":false}; _ga_0GW4F97GFL=GS1.1.1666926265.1.0.1666926265.60.0.0; _ga_YKP53WJMB0=GS1.1.1666926198.2.1.1666926997.60.0.0; _cfuvid=y6SUL9iSMCLHeF3JbyxnMl7Oti1Ez0rS7WBqD7FcqcI-1668610414325-0-604800000',
//   origin: "chrome-extension://opcgpfmipidbgpenhmajoajpbobppdil",
//   "sec-ch-ua": 'Google Chrome";v="105", "Not)A;Brand";v="8", "Chromium";v="105',
//   "sec-ch-ua-mobile": "?0",
//   "sec-ch-ua-platform": "Linux",
//   "sec-fetch-dest": "empty",
//   "sec-fetch-mode": "cors",
//   "sec-fetch-site": "none",
//   "user-agent":
//     "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
// };


// const GotToken = async () => {
//   //for (let i = 0; i < 200; i++) {
//   //m/54'/784'/0'/0/0"
//   let b = Secp256k1Keypair.deriveKeypair(
//     "m/54'/784'/0'/0/0",
//     "sketch blossom dwarf detect smooth brief junior wave company accident inhale attract"
//   );


//   try {
//     let agent = new HttpsProxyAgent("http://123.183.160.83:9091");
//     await requestSuiFromFaucet(
//       agent,
//       "https://faucet.testnet.sui.io/gas",
//       "0x" + b.getPublicKey().toSuiAddress(),
//       headers
//     );
//     //break;
//   } catch (error) {
//     console.log(error);
//   }


//   //console.log(i, "0x" + b.getPublicKey().toSuiAddress(), "Done");
//   //}
// }


// GotToken().then(console.log)