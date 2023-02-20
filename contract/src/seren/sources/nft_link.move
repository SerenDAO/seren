module seren::nft_link {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use std::string::{Self, String};
    use sui::url::{Self, Url};
    use sui::event;
    use std::vector;
    use seren::login_info::{Self, LoginInfo};

    const ECAN_ONLY_MINT_TO_PARTICIPANTS: u64 = 1;
    
    // key ability only and no custom transfer function and therefore is SBT
    struct NFTLink has key {
        // unique nft fields
        id: UID, // unique id of nft, generated on chain
        owner_address: address, // REDUNDANT FIELD
        display: bool, // owner can choose whether to display this in the main page
        // common fields shared by all nfts in the same session
        session_id: u64, // generated off chain shared by all nfts created in the same session
        session_description: String,
        session_type: String,
        session_image_url: Url,
        session_starter_address: address,
        session_participant_addresses: vector<address>, // not including session starter
        session_location_latitude: u64, // of session starter when minted
        session_location_longitude: u64, // of session starter when minted
        session_timestamp: u64, // of session starter when minted
    }
    
    struct MintNFTLinkEvent has copy, drop {
        nft_address: address, // address of nft's id: UID
        owner_address: address,

        session_id: u64,
        session_description: String,
        session_type: String,
        session_image_url: Url,
        session_starter_address: address,
        session_participant_addresses: vector<address>,
        session_location_latitude: u64,
        session_location_longitude: u64,
        session_timestamp: u64,
    }

    // mint and emit
    public entry fun mint(
        user_login: &mut LoginInfo,

        session_id: u64,
        session_description: vector<u8>,
        session_type: vector<u8>,
        session_image_url: vector<u8>,
        session_starter_address: address,
        session_participant_addresses: vector<address>,
        session_location_latitude: u64,
        session_location_longitude: u64,
        session_timestamp: u64,
        ctx: &mut TxContext,
    ) {
        let owner_address = tx_context::sender(ctx);
        assert!(vector::contains(&session_participant_addresses, &owner_address), ECAN_ONLY_MINT_TO_PARTICIPANTS);

        let nft_link = NFTLink {
            id: object::new(ctx),
            owner_address,
            display: true, // default display to true
            session_id,
            session_description: string::utf8(session_description),
            session_type: string::utf8(session_type),
            session_image_url: url::new_unsafe_from_bytes(session_image_url),
            session_starter_address,
            session_participant_addresses,
            session_location_latitude,
            session_location_longitude,
            session_timestamp,
        };

        let nft_address = object::uid_to_address(&nft_link.id);

        event::emit(MintNFTLinkEvent {
            nft_address, // address of nft's id: UID
            owner_address,

            session_id,
            session_description: nft_link.session_description,
            session_type: nft_link.session_type,
            session_image_url: nft_link.session_image_url,
            session_starter_address,
            session_participant_addresses,
            session_location_latitude,
            session_location_longitude,
            session_timestamp,
        });

        transfer::transfer(nft_link, owner_address);
        login_info::add_nft_link_address(user_login, nft_address);
    }

    public entry fun toggle_display(nft: &mut NFTLink) {
        if(nft.display) { 
            nft.display = false;
        } else {
            nft.display = true;
        }
    }

    // getter methods
    public entry fun get_id(nft: &NFTLink): &UID {
        &nft.id
    }

    public entry fun get_owner_address(nft: &NFTLink): &address {
        &nft.owner_address
    }

    public entry fun get_display(nft: &NFTLink): &bool {
        &nft.display
    }

    public entry fun get_session_id(nft: &NFTLink): &u64 {
        &nft.session_id
    }

    public entry fun get_session_description(nft: &NFTLink): &String {
        &nft.session_description
    }

    public entry fun get_session_type(nft: &NFTLink): &String {
        &nft.session_type
    }

    public entry fun get_session_image_url(nft: &NFTLink): &Url {
        &nft.session_image_url
    }

    public entry fun get_session_starter_address(nft: &NFTLink): &address {
        &nft.session_starter_address
    }

    public entry fun get_session_participant_addresses(nft: &NFTLink): &vector<address> {
        &nft.session_participant_addresses
    }

    public entry fun get_session_location_latitude(nft: &NFTLink): &u64 {
        &nft.session_location_latitude
    }

    public entry fun get_session_location_longitude(nft: &NFTLink): &u64 {
        &nft.session_location_longitude
    }

    public entry fun get_session_timestamp(nft: &NFTLink): &u64 {
        &nft.session_timestamp
    }

}