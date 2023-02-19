module seren::nft {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use std::vector;
    use seren::event_link::{Self, EventLink};
    use seren::login_info::{Self, LoginInfo};

    const ECAN_ONLY_MINT_TO_PARTICIPANTS: u64 = 1;
    const ECAN_ONLY_TRANSFER_TO_OWNER: u64 = 2;

    // owner field might be duplicative if NFTLink can't be transferred
    struct NFT has key {
        id: UID, // globally unique
        event_address: address, // not globally unique
        owner: address,
        display: bool, // owner can choose whether to display this in the main page
    }

    public entry fun toggle_display(nft: &mut NFT) {
        if(nft.display) { 
            nft.display = false;
        } else {
            nft.display = true;
        }
    }

    // called by the event starter to create a new EventLink 
    // and mint an NFT associated with that EventLink  
    public entry fun start_event_link(
        description: vector<u8>,
        event_type: vector<u8>,
        event_image_uri: vector<u8>,
        event_starter: address,
        participants: vector<address>,
        location_latitude: u8,
        location_longitude: u8,
        timestamp: u8,
        ctx: &mut TxContext,
    ) {
        let event_address = event_link::create_event_link(
            description,
            event_type,
            event_image_uri,
            event_starter,
            participants,
            location_latitude,
            location_longitude,
            timestamp,
            ctx,
        );

        let sender = tx_context::sender(ctx);

        let nft = NFT {
            id: object::new(ctx),
            event_address,
            owner: sender,
            display: true,
        };
        
        transfer::transfer(nft, sender);
    }

    // called by participants (not event starter) 
    // to mint nft after event has been created
    public entry fun mint_participant_nft_link(
        event: &EventLink,
        ctx: &mut TxContext,
    ) {
        let sender = tx_context::sender(ctx);
        assert!(vector::contains(event_link::borrow_participants(event), &sender), ECAN_ONLY_MINT_TO_PARTICIPANTS);

        let id = object::new(ctx);
        let event_address = event_link::get_event_address(event);

        let nft = NFT {
            id,
            event_address,
            owner: sender, 
            display: true,
        };
        
        transfer::transfer(nft, sender);
    }

}