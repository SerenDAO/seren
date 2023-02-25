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
import FileUpload from '../components/AvatarUpload';
import { provider, signer1, suiObjectId1, packageObjectId } from '../constants/constants';


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