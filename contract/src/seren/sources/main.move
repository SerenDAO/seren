module seren::main {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};

    // can't be transferred once initialized:
    // has key ability and no custom transfer function
    struct Admin has key {
        id: UID,
    }

    fun init(ctx: &mut TxContext) {
        let sender = tx_context::sender(ctx);
        let admin = Admin {
            id: object::new(ctx),
        };
        transfer::transfer(admin, sender);
    }
}