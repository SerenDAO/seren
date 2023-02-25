import {Ed25519Keypair, Secp256k1Keypair, JsonRpcProvider, RawSigner, TypeTag, Network } from '@mysten/sui.js';
import {fromExportedKeypair,MoveEvent,ExportedKeypair} from "@mysten/sui.js";

export const provider = new JsonRpcProvider(Network.DEVNET);

export const schema = new Ed25519Keypair().getKeyScheme();
export const private_key1 = 'c8cJIQOtx55JUNrT0VAGd43cEvscqnO+u4clcXickSlg+Q1PFrl1qKuBlKU0/7KA62GPNDL2++KaFMjHFfZKfg==';
export const private_key2 = 'Ypuiv4wJk7N6z7iVWt41F/94FEHQebE95uGqp8/5XjNhcRPZkJzlIqlE0R7Y/iLFwOiTRAh3eiescM6m0LwyIA==';
export const key_pair_struct1:ExportedKeypair = {
    schema,
    privateKey:private_key1
}
export const key_pair_struct2:ExportedKeypair = {
    schema,
    privateKey:private_key2
}
export const keypair1 = fromExportedKeypair(key_pair_struct1);
export const keypair2 = fromExportedKeypair(key_pair_struct2);

export const signer1 = new RawSigner(keypair1, provider);
export const signer2 = new RawSigner(keypair2, provider);

export const suiObjectId1 = "0x111d3734af9c972bbb279b4c95361d5eb7f829ce";

export const testAddress1 = '0xb9c39335bacc416fa067aacc1c775435c7d53179';
export const testAddress2 = '0x0895e19842c2a081b161f685aa2f3b816ceb50ed';
export const testAddress3 = '0xa9bb5225de506ba7b77f396f481d626a6cdbed9c';

export const packageObjectId = '0x5fed48ec5c7c7f9cc18888a07de9fbe843d699e8';