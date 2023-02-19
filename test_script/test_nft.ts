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

const signer1 = new RawSigner(keypair1, provider);
const signer2 = new RawSigner(keypair2, provider);

const testAddress1 = '0xb9c39335bacc416fa067aacc1c775435c7d53179';
const testAddress2 = '0x0895e19842c2a081b161f685aa2f3b816ceb50ed';
const testAddress3 = '0xa9bb5225de506ba7b77f396f481d626a6cdbed9c';

const login1 = "0xde152af5c7275d3e76715fe34e5e3402fdd146b0";

const create_login_info = async(signer: any) => {
    const moveCallTxn = await signer.executeMoveCall({
        packageObjectId,
        module: 'login_info',
        function: 'create_login_info',
        typeArguments: [],
        arguments: [
            "www.google.com"
        ],
        gasBudget: 10000,
    });
    console.log(moveCallTxn);
}

const mint = async (signer:any) =>{
    const user_login = login1;
    const session_id: number = 100;
    const session_description = "test session";
    const session_type = "link";
    const session_image_url = "www.google.com";
    const session_starter_address = testAddress1;
    const session_participant_addresses = [testAddress1, testAddress2, testAddress3];
    const session_location_latitude = 200;
    const session_location_longitude = 300;
    const session_timestamp = 400;

    const moveCallTxn = await signer.executeMoveCall({
        packageObjectId,
        module: 'nft_link',
        function: 'mint',
        typeArguments: [],
        arguments: [
            user_login,
            session_id,
            session_description,
            session_type,
            session_image_url,
            session_starter_address,
            session_participant_addresses,
            session_location_latitude,
            session_location_longitude,
            session_timestamp,
        ],
        gasBudget: 10000,
    });
    console.log(moveCallTxn);
}

const main = async() =>{
    // await create_login_info(signer1);
    await mint(signer1);
}
main();