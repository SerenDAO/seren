import {Ed25519Keypair, JsonRpcProvider, RawSigner, TypeTag} from '@mysten/sui.js';
import {fromExportedKeypair} from "@mysten/sui.js";
import {ExportedKeypair} from "@mysten/sui.js/src/cryptography/keypair";
import { packageObjectId } from './constants';
const provider = new JsonRpcProvider();
const schema = new Ed25519Keypair().getKeyScheme();
const private_key1 = 'c8cJIQOtx55JUNrT0VAGd43cEvscqnO+u4clcXickSlg+Q1PFrl1qKuBlKU0/7KA62GPNDL2++KaFMjHFfZKfg=='
const private_key2 = 'Ypuiv4wJk7N6z7iVWt41F/94FEHQebE95uGqp8/5XjNhcRPZkJzlIqlE0R7Y/iLFwOiTRAh3eiescM6m0LwyIA=='
const key_pair_struct1:ExportedKeypair = {
    schema,
    privateKey:private_key1
}
const key_pair_struct2:ExportedKeypair = {
    schema,
    privateKey:private_key2
}
const keypair1 = fromExportedKeypair(key_pair_struct1)
const keypair2 = fromExportedKeypair(key_pair_struct2)
const testAddress1 = '0xb9c39335bacc416fa067aacc1c775435c7d53179';
const testAddress2 = '0x0895e19842c2a081b161f685aa2f3b816ceb50ed';
const testAddress3 = '0xa9bb5225de506ba7b77f396f481d626a6cdbed9c';
const testAddress4 = '0x4';
const testEvent1 = "0x4254c2f5486424aaafbaec3a67b359be9bdc40f2";

const start_event_link = async (signer:any) =>{
    const description = "test event link name";
    const event_type = "event link";
    const event_image_uri = "https://www.google.com";
    const event_starter = testAddress1;
    const participants = [testAddress2, testAddress3];
    const location_latitude = 100;
    const location_longitude = 200;
    const timestamp = 100;
    
    const moveCallTxn = await signer.executeMoveCall({
        packageObjectId,
        module: 'nft',
        function: 'start_event_link',
        typeArguments: [],
        arguments: [
            description,
            event_type,
            event_image_uri,
            event_starter,
            participants,
            location_latitude,
            location_longitude,
            timestamp,
        ],
        gasBudget: 10000,
    });
    console.log(moveCallTxn);
}

const mint_participant_nft_link = async (signer:any) =>{
    
    const moveCallTxn = await signer.executeMoveCall({
        packageObjectId,
        module: 'nft',
        function: 'mint_participant_nft_link',
        typeArguments: [],
        arguments: [
            testEvent1
        ],
        gasBudget: 10000,
    });
    console.log(moveCallTxn);
}

const main = async() =>{
    const signer1 = new RawSigner(keypair1, provider);
    const signer2 = new RawSigner(keypair2, provider);
    // await start_event_link(signer1);
    await mint_participant_nft_link(signer2);
}
main()