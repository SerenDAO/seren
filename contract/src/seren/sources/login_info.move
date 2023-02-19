module seren::login_info {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use std::vector;
    use seren::nft::{NFT};

    // can't be transferred once initialized:
    // has key ability and no custom transfer function
    struct LoginInfo has key {
        id: UID,
        avatar_uri: vector<u8>,
        nft_addresses: vector<address>, // object address of NFT
    }

    public entry fun create_login_info(avatar_uri: vector<u8>, ctx: &mut TxContext) {
        let sender = tx_context::sender(ctx);
        
        let login_info = LoginInfo {
            id: object::new(ctx),
            avatar_uri: avatar_uri,
            nft_addresses: vector::empty<address>(),
        };

        transfer::transfer(login_info, sender);
    }

}