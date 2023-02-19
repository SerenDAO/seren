module seren::login_info {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use std::vector;
    use sui::url::{Self, Url};

    // can't be transferred once initialized:
    // has key ability and no custom transfer function
    struct LoginInfo has key {
        id: UID,
        avatar_url: Url,
        nft_addresses: vector<address>, // object address of NFT
    }

    public entry fun create_login_info(avatar_url: vector<u8>, ctx: &mut TxContext) {
        let sender = tx_context::sender(ctx);
        
        let login_info = LoginInfo {
            id: object::new(ctx),
            avatar_url: url::new_unsafe_from_bytes(avatar_url),
            nft_addresses: vector::empty<address>(), // REDUNDANT FIELD
        };

        transfer::transfer(login_info, sender);
    }

    public fun add_nft_link_address(login_info: &mut LoginInfo, nft_link_address: address) {
        vector::push_back(&mut login_info.nft_addresses, nft_link_address);
    }

}