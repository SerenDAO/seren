import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import { Ed25519Keypair, Secp256k1Keypair, JsonRpcProvider, RawSigner, TypeTag, Network } from '@mysten/sui.js';
import { fromExportedKeypair, MoveEvent, ExportedKeypair } from "@mysten/sui.js";
import { useState, useEffect } from 'react';
import { generateKeyPair } from 'crypto';
import { TransferSuiTransaction } from '@mysten/sui.js/dist/signers/txn-data-serializers/txn-data-serializer';
import "bootstrap/dist/css/bootstrap.min.css";
import AvatarUpload from '../components/AvatarUpload';
import CreateSuiAddress from '../components/CreateSuiAddress';
import UserHome from '../components/UserHome';

export default function Home() {
  const [component, setComponent] = useState<string>("CreateAccount");

  const [keypair, setKeypair] = useState<Ed25519Keypair>();
  const [publicKey, setPublicKey] = useState<string>();
  const [secretKey, setSecretKey] = useState<string>();
  const [rawSigner, setRawSigner] = useState<RawSigner>();
  const [address, setAddress] = useState<string>();
  const [suiBalance, setSuiBalance] = useState<number>();
  const [loginInfo, setLoginInfo] = useState<string>();

  return (
    <div>
      {component === "CreateAccount" &&
        <CreateSuiAddress
          component={component}
          setComponent={setComponent}
          keypair={keypair}
          setKeypair={setKeypair}
          publicKey={publicKey}
          setPublicKey={setPublicKey}
          secretKey={secretKey}
          setSecretKey={setSecretKey}
          rawSigner={rawSigner}
          setRawSigner={setRawSigner}
          address={address}
          setAddress={setAddress}
          suiBalance={suiBalance}
          setSuiBalance={setSuiBalance}
        />
      }

      {component === "AvatarUpload" && <AvatarUpload component={component} setComponent={setComponent} rawSigner={rawSigner} loginInfo={loginInfo} setLoginInfo={setLoginInfo} />}

      {component === "UserHome" && <UserHome loginInfo={loginInfo} setLoginInfo={setLoginInfo} address={address} />}

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