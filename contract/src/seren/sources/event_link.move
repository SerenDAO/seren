module seren::event_link {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    
    // owned by the event starter but not transferable
    struct EventLink has key {
        id: UID,
        description: vector<u8>,
        event_type: vector<u8>,
        event_image_uri: vector<u8>,
        event_starter: address,
        participants: vector<address>, // not including event starter
        location_latitude: u8, // of event starter when event created
        location_longitude: u8, // of event starter when minted
        timestamp: u8, // of of event starter when minted
    }

    public fun borrow_participants(event_link: &EventLink): &vector<address> {
        &event_link.participants
    }

    public fun get_event_address(event_link: &EventLink): address {
        let uid = &event_link.id;
        let addr = object::uid_to_address(uid);
        
        addr 
    }

    // called by event starter when creating an event
    // set as entry for testing purpose for now
    public fun create_event_link(
        description: vector<u8>,
        event_type: vector<u8>,
        event_image_uri: vector<u8>,
        event_starter: address,
        participants: vector<address>,
        location_latitude: u8,
        location_longitude: u8,
        timestamp: u8,
        ctx: &mut TxContext,
    ): address {
        let sender = tx_context::sender(ctx);
        let id = object::new(ctx); // UID
        let event_link_address = object::uid_to_address(&id); // address
        let event_link = EventLink {
            id, 
            description,
            event_type,
            event_image_uri,
            event_starter: sender,
            participants,
            location_latitude,
            location_longitude,
            timestamp,
        };
        transfer::share_object(event_link); // question: shared object can only be modified by methods defined in the module where it's created?
        
        event_link_address 

    }

}