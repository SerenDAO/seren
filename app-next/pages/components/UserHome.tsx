import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import {Ed25519Keypair, Secp256k1Keypair, JsonRpcProvider, RawSigner, TypeTag, Network } from '@mysten/sui.js';
import {fromExportedKeypair,MoveEvent,ExportedKeypair} from "@mysten/sui.js";
import { useState, useEffect } from 'react';
import { generateKeyPair } from 'crypto';
import { TransferSuiTransaction } from '@mysten/sui.js/dist/signers/txn-data-serializers/txn-data-serializer';
import "bootstrap/dist/css/bootstrap.min.css";
import { provider, signer1, suiObjectId1, packageObjectId } from '../constants/constants';
import CreateSuiAddressProps from '../type/CreateSuiAddressProps';
import UserHomeProps from '../type/UserHomeProps';

const UserHome = ({loginInfo, setLoginInfo}: UserHomeProps) => {
    
    useEffect(() => {
        console.log(loginInfo)
    }, [])

    return (
        <div>

        </div>
    );
}

export default UserHome;