/* 
    This quest features a Non Fungible Token (NFT) module. The module allows the collection manager 
    to mint NFTs and withdraw NFT sales, allows users to combine two NFTs into a new NFT and burn 
    NFTs.

    Collection manager
        The collection manager is the owner of the MinterCap object. The collection manager can mint
        NFTs and withdraw NFT sales.

    Minting NFTs
        In this module, NFTs are minted by the manager of the collection. Minting an NFT requires a
        payment of 1 SUI, which is sent to the MinterCap object. Any change is returned to the 
        sender of the transaction. The NFT is then transferred to the recipient. The NFT is 
        represented by the NonFungibleToken object.

    Burning NFTs
        Anyone that owns an NFT can burn it. The NFT is deleted.

    Withdrawing NFT sales
        THe collection manager can withdraw the sales balance from the MinterCap object. The sales
        balance is the total amount of SUI that has been paid for NFTs. 

    Public Getters
        The module provides public getters for the name, description and image of an NFT. This can 
        be called by anyone on any existing NFT.
*/
#[allow(unused_function)]
module addrx::nft {

    //==============================================================================================
    // Dependencies
    //==============================================================================================
    use sui::event;
    use std::vector;
    use sui::sui::SUI;
    use sui::transfer;
    use sui::url::{Self, Url};
    use sui::coin::{Self, Coin};
    use std::string::{Self, String};
    use sui::object::{Self, UID, ID};
    use sui::balance::{Self, Balance};
    use sui::tx_context::{Self, TxContext};
    //use std::debug;

    #[test_only]
    use sui::test_scenario;
    #[test_only]
    use sui::test_utils::assert_eq;

    //==============================================================================================
    // Constants - Add your constants here (if any)
    //==============================================================================================
    const PRICE: u64 = 1000000000; //1 SUI

    //==============================================================================================
    // Error codes - DO NOT MODIFY
    //==============================================================================================
    const EInsufficientPayment: u64 = 1;
    const ENotOwner: u64 = 2;

    //==============================================================================================
    // Module Structs - DO NOT MODIFY
    //==============================================================================================

    /* 
        The NonFungibleToken object represents an NFT. It contains the following fields:
        - `id` - the ID of the NFT
        - `name` - the name of the NFT
        - `description` - the description of the NFT
        - `image` - the image of the NFT
    */
    struct NonFungibleToken has key {
        id: UID,
        name: String,
        description: String,
        image: Url,
    }

    /* 
        The MinterCap object represents the minter cap. It contains the following fields:
        - `id` - the ID of the MinterCap object
        - `sales` - the sales balance of the MinterCap object
    */
    struct MinterCap has key {
        id: UID,
        sales: Balance<SUI>,
    }

    //==============================================================================================
    // Event structs - DO NOT MODIFY
    //==============================================================================================
    /* 
        Event emitted when an NFT is minted in mint_nft. It contains the following fields:
        - `nft_id` - the ID of the NFT
        - `recipient` - the address of the recipient
    */
    struct NonFungibleTokenMinted has copy, drop {
        nft_id: ID,
        recipient: address
    }

    /* 
        Event emitted when two NFTs are combined into a new NFT. It contains the following 
        fields:
        - `nft1_id` - the ID of the first NFT
        - `nft2_id` - the ID of the second NFT
        - `new_nft_id` - the ID of the new NFT
    */
    struct NonFungibleTokenCombined has copy, drop {
        nft1_id: ID,
        nft2_id: ID,
        new_nft_id: ID,
    }

    /* 
        Event emitted when an NFT is deleted in burn_nft. It contains the following fields:
        - `nft_id` - the ID of the NFT
    */
    struct NonFungibleTokenDeleted has copy, drop {
        nft_id: ID,
    }

    /* 
        Event emitted whenever the sales balance is withdrawn from the MinterCap object. It 
        contains the following fields:
        - `amount` - the amount withdrawn
    */
    struct SalesWithdrawn has copy, drop {
        amount: u64
    }


    //==============================================================================================
    // Functions
    //==============================================================================================
    
    /* 
        Initializes the minter cap object and transfers it to the deployer of the module. 
        This function is called only once during the deployment of the module.
        @param ctx - the transaction context
    */
    fun init(ctx: &mut TxContext) {
        let minter_cap = MinterCap{
            id: object::new(ctx),
            sales: balance::zero(),
        };
        transfer::transfer(minter_cap,tx_context::sender(ctx));
    }

    /* 
        Mints a new NFT and transfers it to the recipient. This can only be called by the owner of 
        the MinterCap object. The remaining payment is returned. Abort if the payment is below the 
        price of the NFT.
        @param recipient - the address of the recipient
        @param nft_name - the name of the NFT
        @param nft_description - the description of the NFT
        @param nft_image - the image of the NFT
        @param payment_coin - the coin used to pay for the NFT
        @param minter_cap - the minter cap object
        @param ctx - the transaction context
        @return the change coin
    */
    public fun mint_nft(
        recipient: address, 
        nft_name: vector<u8>, 
        nft_description: vector<u8>, 
        nft_image: vector<u8>,
        payment_coin: &mut Coin<SUI>,
        minter_cap: &mut MinterCap,
        ctx: &mut TxContext, 
    ) {
        //let minter_cap_add = object::id_to_address(&object::uid_to_inner(&minter_cap.id));
        //assert_minter_cap_owner(minter_cap_add, tx_context::sender(ctx));
        let payment = coin::value(payment_coin);
        assert_sufficient_payment(payment, PRICE);
        let id = object::new(ctx);
        let nft_id = object::uid_to_inner(&id);
        let nft = NonFungibleToken{
            id,
            name: string::utf8(nft_name),
            description: string::utf8(nft_description),
            image: url::new_unsafe_from_bytes(nft_image),
        };
        event::emit(NonFungibleTokenMinted{
            nft_id,
            recipient
        });
        transfer::transfer(nft,recipient);
        let paid = coin::split(payment_coin, PRICE, ctx); 
        coin::put(&mut minter_cap.sales, paid);
    }

    
    /* 
        Withdraws the sales balance from the MinterCap object. This can only be called by the owner 
        of the MinterCap object.
        @param minter_cap - the minter cap object
        @param ctx - the transaction context
        @return the withdrawn coin
    */
    public fun withdraw_sales(
        minter_cap: &mut MinterCap,
        ctx: &mut TxContext,
    ): Coin<SUI> {
        let balance = balance::value(&minter_cap.sales);
        let withdrawal = coin::take(&mut minter_cap.sales, balance, ctx);
        //transfer::public_transfer(withdrawal, tx_context::sender(ctx));
        event::emit(SalesWithdrawn{
            amount: balance
        });
        withdrawal
    }

    /*
        Deletes the NFT object. This can only be called by the owner of the NFT object.
        @param nft - the NFT object
    */
    public fun burn_nft(nft: NonFungibleToken) {
        let NonFungibleToken{id, name, description, image} = nft;
        event::emit(NonFungibleTokenDeleted{
            nft_id: sui::object::uid_to_inner(&id)
        });
        object::delete(id);
    }

    /* 
        Gets the NFT's `name`
        @param nft - the NFT object
        @return the NFT's `name`
    */
    public fun name(nft: &NonFungibleToken): String {
        nft.name
    }

    /* 
        Gets the NFT's `description`
        @param nft - the NFT object
        @return the NFT's `description`
    */
    public fun description(nft: &NonFungibleToken): String {
        nft.description
    }

    /* 
        Gets the NFT's `image`
        @param nft - the NFT object
        @return the NFT's `image`
    */
    public fun url(nft: &NonFungibleToken): Url {
        nft.image
    }

    //==============================================================================================
    // Helper functions - Add your helper functions here (if any)
    //==============================================================================================

    //==============================================================================================
    // Validation functions - Add your validation functions here (if any)
    //==============================================================================================

    // fun assert_minter_cap_owner(cap_id_to_add: address, user_add: address){
    //     assert!(cap_id_to_add == user_add, ENotOwner);
    // }

    fun assert_sufficient_payment(payment: u64, price: u64){
        assert!(payment >= price, EInsufficientPayment);
    }

    //==============================================================================================
    // Tests - DO NOT MODIFY
    //==============================================================================================
    #[test]
    fun test_init_success() {
        let module_owner = @0xa;

        let scenario_val = test_scenario::begin(module_owner);
        let scenario = &mut scenario_val;

        {
            init(test_scenario::ctx(scenario));
        };
        let tx = test_scenario::next_tx(scenario, module_owner);
        let expected_events_emitted = 0;
        let expected_created_objects = 1;
        assert_eq(
            test_scenario::num_user_events(&tx), 
            expected_events_emitted
        );
        assert_eq(
            vector::length(&test_scenario::created(&tx)),
            expected_created_objects
        );

        {
            let minter_cap = test_scenario::take_from_sender<MinterCap>(scenario);

            assert_eq(
                balance::value(&minter_cap.sales), 
                0
            );

            test_scenario::return_to_sender(scenario, minter_cap);
        };
        test_scenario::end(scenario_val);
    }

    #[test]
    fun test_mint_nft_success_perfect_change() {
        let module_owner = @0xa;
        let recipient = @0xb;
        
        let scenario_val = test_scenario::begin(module_owner);
        let scenario = &mut scenario_val;

        {
            init(test_scenario::ctx(scenario));
        };
        let tx = test_scenario::next_tx(scenario, module_owner);
        let expected_events_emitted = 0;
        let expected_created_objects = 1;
        assert_eq(
            test_scenario::num_user_events(&tx), 
            expected_events_emitted
        );
        assert_eq(
            vector::length(&test_scenario::created(&tx)),
            expected_created_objects
        );

        let nft_name = b"test_nft_name";
        let nft_description = b"test_nft_description";
        let nft_image = b"test_nft_image";
        let payment_amount = 1000000000;
        let change = 0;
        {
            let payment_coin = sui::coin::mint_for_testing<SUI>(
                payment_amount + change,
                test_scenario::ctx(scenario)
            );

            let minter_cap = test_scenario::take_from_sender<MinterCap>(scenario);
            
            mint_nft(
                recipient, 
                nft_name, 
                nft_description, 
                nft_image,
                &mut payment_coin,
                &mut minter_cap,
                test_scenario::ctx(scenario)
            );

            assert_eq(
                coin::value(&payment_coin), 
                change
            );
            coin::burn_for_testing(payment_coin);

            test_scenario::return_to_sender(scenario, minter_cap);
        };
        let tx = test_scenario::next_tx(scenario, recipient);
        let expected_events_emitted = 1;
        let expected_created_objects = 1;
        assert_eq(
            test_scenario::num_user_events(&tx), 
            expected_events_emitted
        );
        assert_eq(
            vector::length(&test_scenario::created(&tx)),
            expected_created_objects
        );

        {
            let nft = test_scenario::take_from_sender<NonFungibleToken>(scenario);

            assert_eq(
                nft.name, 
                string::utf8(nft_name)
            );
            assert_eq(
                nft.description, 
                string::utf8(nft_description)
            );
            assert_eq(
                nft.image, 
                url::new_unsafe_from_bytes(nft_image)
            );

            test_scenario::return_to_sender(scenario, nft);
        };
        
        test_scenario::end(scenario_val);
    }

    #[test]
    fun test_mint_nft_success_has_change() {
        let module_owner = @0xa;
        let recipient = @0xb;
        
        let scenario_val = test_scenario::begin(module_owner);
        let scenario = &mut scenario_val;

        {
            init(test_scenario::ctx(scenario));
        };
        let tx = test_scenario::next_tx(scenario, module_owner);
        let expected_events_emitted = 0;
        let expected_created_objects = 1;
        assert_eq(
            test_scenario::num_user_events(&tx), 
            expected_events_emitted
        );
        assert_eq(
            vector::length(&test_scenario::created(&tx)),
            expected_created_objects
        );

        let nft_name = b"test_nft_name";
        let nft_description = b"test_nft_description";
        let nft_image = b"test_nft_image";
        let payment_amount = 1000000000;
        let change = 100000000;
        {
            let payment_coin = sui::coin::mint_for_testing<SUI>(
                payment_amount + change,
                test_scenario::ctx(scenario)
            );

            let minter_cap = test_scenario::take_from_sender<MinterCap>(scenario);
            
            mint_nft(
                recipient, 
                nft_name, 
                nft_description, 
                nft_image,
                &mut payment_coin,
                &mut minter_cap,
                test_scenario::ctx(scenario)
            );

            assert_eq(
                coin::value(&payment_coin), 
                change
            );
            coin::burn_for_testing(payment_coin);

            test_scenario::return_to_sender(scenario, minter_cap);
        };
        let tx = test_scenario::next_tx(scenario, recipient);
        let expected_events_emitted = 1;
        let expected_created_objects = 1;
        assert_eq(
            test_scenario::num_user_events(&tx), 
            expected_events_emitted
        );
        assert_eq(
            vector::length(&test_scenario::created(&tx)),
            expected_created_objects
        );

        {
            let nft = test_scenario::take_from_sender<NonFungibleToken>(scenario);

            assert_eq(
                nft.name, 
                string::utf8(nft_name)
            );
            assert_eq(
                nft.description, 
                string::utf8(nft_description)
            );
            assert_eq(
                nft.image, 
                url::new_unsafe_from_bytes(nft_image)
            );

            test_scenario::return_to_sender(scenario, nft);
        };
        
        test_scenario::end(scenario_val);
    }

    #[test, expected_failure(abort_code = EInsufficientPayment)]
    fun test_mint_nft_failure_insufficient_funds() {
        let module_owner = @0xa;
        let recipient = @0xb;
        
        let scenario_val = test_scenario::begin(module_owner);
        let scenario = &mut scenario_val;

        {
            init(test_scenario::ctx(scenario));
        };
        let tx = test_scenario::next_tx(scenario, module_owner);
        let expected_events_emitted = 0;
        let expected_created_objects = 1;
        assert_eq(
            test_scenario::num_user_events(&tx), 
            expected_events_emitted
        );
        assert_eq(
            vector::length(&test_scenario::created(&tx)),
            expected_created_objects
        );

        let nft_name = b"test_nft_name";
        let nft_description = b"test_nft_description";
        let nft_image = b"test_nft_image";
        let payment_amount = 900000000;
        let change = 0;
        {
            let payment_coin = sui::coin::mint_for_testing<SUI>(
                payment_amount + change,
                test_scenario::ctx(scenario)
            );

            let minter_cap = test_scenario::take_from_sender<MinterCap>(scenario);
            
            mint_nft(
                recipient, 
                nft_name, 
                nft_description, 
                nft_image,
                &mut payment_coin,
                &mut minter_cap,
                test_scenario::ctx(scenario)
            );

            assert_eq(
                coin::value(&payment_coin), 
                change
            );
            coin::burn_for_testing(payment_coin);

            test_scenario::return_to_sender(scenario, minter_cap);
        };
        test_scenario::end(scenario_val);
    }

    

   
    #[test]
    fun test_burn_nft_success() {
        let module_owner = @0xa;
        let nft_owner = @0xb;

        let scenario_val = test_scenario::begin(module_owner);
        let scenario = &mut scenario_val;

        {
            init(test_scenario::ctx(scenario));
        };
        let tx = test_scenario::next_tx(scenario, module_owner);
        let expected_events_emitted = 0;
        let expected_created_objects = 1;
        assert_eq(
            test_scenario::num_user_events(&tx), 
            expected_events_emitted
        );
        assert_eq(
            vector::length(&test_scenario::created(&tx)),
            expected_created_objects
        );

        let nft_name = b"test_nft_name";
        let nft_description = b"test_nft_description";
        let nft_image = b"test_nft_image";
        let payment_amount = 1000000000;
        let change = 0;
        {
            let payment_coin = sui::coin::mint_for_testing<SUI>(
                payment_amount + change,
                test_scenario::ctx(scenario)
            );

            let minter_cap = test_scenario::take_from_sender<MinterCap>(scenario);
            
            mint_nft(
                nft_owner, 
                nft_name, 
                nft_description, 
                nft_image,
                &mut payment_coin,
                &mut minter_cap,
                test_scenario::ctx(scenario)
            );

            assert_eq(
                coin::value(&payment_coin), 
                change
            );
            coin::burn_for_testing(payment_coin);

            test_scenario::return_to_sender(scenario, minter_cap);
        };
        let tx = test_scenario::next_tx(scenario, nft_owner);
        let expected_events_emitted = 1;
        let expected_created_objects = 1;
        assert_eq(
            test_scenario::num_user_events(&tx), 
            expected_events_emitted
        );
        assert_eq(
            vector::length(&test_scenario::created(&tx)),
            expected_created_objects
        );
        let nft_id = vector::remove(&mut test_scenario::created(&tx), 0);

        {
            let nft = test_scenario::take_from_address_by_id(scenario, nft_owner, nft_id);

            burn_nft(nft);
        };
        test_scenario::end(scenario_val);
        let expected_events_emitted = 1;
        assert_eq(
            test_scenario::num_user_events(&tx), 
            expected_events_emitted
        );
    }

    #[test]
    fun test_name_success_1() {
        let module_owner = @0xa;
        let nft_owner = @0xb;

        let scenario_val = test_scenario::begin(module_owner);
        let scenario = &mut scenario_val;

        {
            init(test_scenario::ctx(scenario));
        };
        test_scenario::next_tx(scenario, module_owner);
        
        let nft_name = b"test_nft_name";
        let nft_description = b"test_nft_description";
        let nft_image = b"test_nft_image";
        let payment_amount = 1000000000;
        let change = 0;
        {
            let payment_coin = sui::coin::mint_for_testing<SUI>(
                payment_amount + change,
                test_scenario::ctx(scenario)
            );

            let minter_cap = test_scenario::take_from_sender<MinterCap>(scenario);
            
            mint_nft(
                nft_owner, 
                nft_name, 
                nft_description, 
                nft_image,
                &mut payment_coin,
                &mut minter_cap,
                test_scenario::ctx(scenario)
            );

            assert_eq(
                coin::value(&payment_coin), 
                change
            );
            coin::burn_for_testing(payment_coin);


            test_scenario::return_to_sender(scenario, minter_cap);
        };

        let tx = test_scenario::next_tx(scenario, nft_owner);
        let nft_id = vector::remove(&mut test_scenario::created(&tx), 0);

        {
            let nft = test_scenario::take_from_address_by_id(scenario, nft_owner, nft_id);

            assert_eq(
                name(&nft), 
                string::utf8(nft_name)
            );

            test_scenario::return_to_sender(scenario, nft);
        };

        test_scenario::end(scenario_val);
    }

    #[test]
    fun test_name_success_2() {
        let module_owner = @0xa;
        let nft_owner = @0xb;

        let scenario_val = test_scenario::begin(module_owner);
        let scenario = &mut scenario_val;

        {
            init(test_scenario::ctx(scenario));
        };

        test_scenario::next_tx(scenario, module_owner);
        
        let nft_name = b"test_nft_name_34";
        let nft_description = b"test_nft_description";
        let nft_image = b"test_nft_image";
        let payment_amount = 1000000000;
        let change = 0;
        {
            let payment_coin = sui::coin::mint_for_testing<SUI>(
                payment_amount + change,
                test_scenario::ctx(scenario)
            );

            let minter_cap = test_scenario::take_from_sender<MinterCap>(scenario);
            
            mint_nft(
                nft_owner, 
                nft_name, 
                nft_description, 
                nft_image,
                &mut payment_coin,
                &mut minter_cap,
                test_scenario::ctx(scenario)
            );

            assert_eq(
                coin::value(&payment_coin), 
                change
            );
            coin::burn_for_testing(payment_coin);

            test_scenario::return_to_sender(scenario, minter_cap);
        };
        let tx = test_scenario::next_tx(scenario, nft_owner);

        let nft_id = vector::remove(&mut test_scenario::created(&tx), 0);

        {
            let nft = test_scenario::take_from_address_by_id(scenario, nft_owner, nft_id);

            assert_eq(
                name(&nft), 
                string::utf8(nft_name)
            );

            test_scenario::return_to_sender(scenario, nft);
        };

        test_scenario::end(scenario_val);
    }

    #[test]
    fun test_description_success_1() {
        let module_owner = @0xa;
        let nft_owner = @0xb;

        let scenario_val = test_scenario::begin(module_owner);
        let scenario = &mut scenario_val;

        {
            init(test_scenario::ctx(scenario));
        };
        test_scenario::next_tx(scenario, module_owner);
        
        let nft_name = b"test_nft_name";
        let nft_description = b"test_nft_description";
        let nft_image = b"test_nft_image";
        let payment_amount = 1000000000;
        let change = 0;
        {
            let payment_coin = sui::coin::mint_for_testing<SUI>(
                payment_amount + change,
                test_scenario::ctx(scenario)
            );

            let minter_cap = test_scenario::take_from_sender<MinterCap>(scenario);
            
            mint_nft(
                nft_owner, 
                nft_name, 
                nft_description, 
                nft_image,
                &mut payment_coin,
                &mut minter_cap,
                test_scenario::ctx(scenario)
            );
            assert_eq(
                coin::value(&payment_coin), 
                change
            );
            coin::burn_for_testing(payment_coin);


            test_scenario::return_to_sender(scenario, minter_cap);
        };

        let tx = test_scenario::next_tx(scenario, nft_owner);
        let nft_id = vector::remove(&mut test_scenario::created(&tx), 0);
        {
            let nft = test_scenario::take_from_address_by_id(scenario, nft_owner, nft_id);

            assert_eq(
                description(&nft), 
                string::utf8(nft_description)
            );

            test_scenario::return_to_sender(scenario, nft);
        };

        test_scenario::end(scenario_val);
    }

    #[test]
    fun test_description_success_2() {
        let module_owner = @0xa;
        let nft_owner = @0xb;

        let scenario_val = test_scenario::begin(module_owner);
        let scenario = &mut scenario_val;

        {
            init(test_scenario::ctx(scenario));
        };

        test_scenario::next_tx(scenario, module_owner);
        
        let nft_name = b"test_nft_name_34";
        let nft_description = b"test_nft_description43";
        let nft_image = b"test_nft_image2";
        let payment_amount = 1000000000;
        let change = 0;
        {
            let payment_coin = sui::coin::mint_for_testing<SUI>(
                payment_amount + change,
                test_scenario::ctx(scenario)
            );

            let minter_cap = test_scenario::take_from_sender<MinterCap>(scenario);
            
            mint_nft(
                nft_owner, 
                nft_name, 
                nft_description, 
                nft_image,
                &mut payment_coin,
                &mut minter_cap,
                test_scenario::ctx(scenario)
            );

            assert_eq(
                coin::value(&payment_coin), 
                change
            );
            coin::burn_for_testing(payment_coin);

            test_scenario::return_to_sender(scenario, minter_cap);
        };
        let tx = test_scenario::next_tx(scenario, nft_owner);

        let nft_id = vector::remove(&mut test_scenario::created(&tx), 0);

        {
            let nft = test_scenario::take_from_address_by_id(scenario, nft_owner, nft_id);

            assert_eq(
                description(&nft), 
                string::utf8(nft_description)
            );

            test_scenario::return_to_sender(scenario, nft);
        };

        test_scenario::end(scenario_val);
    }

    #[test]
    fun test_url_success_1() {
        let module_owner = @0xa;
        let nft_owner = @0xb;

        let scenario_val = test_scenario::begin(module_owner);
        let scenario = &mut scenario_val;

        {
            init(test_scenario::ctx(scenario));
        };
        test_scenario::next_tx(scenario, module_owner);
        
        let nft_name = b"test_nft_name";
        let nft_description = b"test_nft_description";
        let nft_image = b"test_nft_image";
        let payment_amount = 1000000000;
        let change = 0;
        {
            let payment_coin = sui::coin::mint_for_testing<SUI>(
                payment_amount + change,
                test_scenario::ctx(scenario)
            );

            let minter_cap = test_scenario::take_from_sender<MinterCap>(scenario);
            
            mint_nft(
                nft_owner, 
                nft_name, 
                nft_description, 
                nft_image,
                &mut payment_coin,
                &mut minter_cap,
                test_scenario::ctx(scenario)
            );

            assert_eq(
                coin::value(&payment_coin), 
                change
            );
            coin::burn_for_testing(payment_coin);


            test_scenario::return_to_sender(scenario, minter_cap);
        };

        let tx = test_scenario::next_tx(scenario, nft_owner);
        let nft_id = vector::remove(&mut test_scenario::created(&tx), 0);

        {
            let nft = test_scenario::take_from_address_by_id(scenario, nft_owner, nft_id);

            assert_eq(
                url(&nft), 
                url::new_unsafe_from_bytes(nft_image)
            );

            test_scenario::return_to_sender(scenario, nft);
        };

        test_scenario::end(scenario_val);
    }

    #[test]
    fun test_url_success_2() {
        let module_owner = @0xa;
        let nft_owner = @0xb;

        let scenario_val = test_scenario::begin(module_owner);
        let scenario = &mut scenario_val;

        {
            init(test_scenario::ctx(scenario));
        };

        test_scenario::next_tx(scenario, module_owner);
        
        let nft_name = b"test_nft_name_34";
        let nft_description = b"test_nft_description43";
        let nft_image = b"test_nft_image2";
        let payment_amount = 1000000000;
        let change = 0;
        {
            let payment_coin = sui::coin::mint_for_testing<SUI>(
                payment_amount + change,
                test_scenario::ctx(scenario)
            );

            let minter_cap = test_scenario::take_from_sender<MinterCap>(scenario);
            
            mint_nft(
                nft_owner, 
                nft_name, 
                nft_description, 
                nft_image,
                &mut payment_coin,
                &mut minter_cap,
                test_scenario::ctx(scenario)
            );

            assert_eq(
                coin::value(&payment_coin), 
                change
            );
            coin::burn_for_testing(payment_coin);

            test_scenario::return_to_sender(scenario, minter_cap);
        };
        let tx = test_scenario::next_tx(scenario, nft_owner);

        let nft_id = vector::remove(&mut test_scenario::created(&tx), 0);

        {
            let nft = test_scenario::take_from_address_by_id(scenario, nft_owner, nft_id);

            assert_eq(
                url(&nft), 
                url::new_unsafe_from_bytes(nft_image)
            );

            test_scenario::return_to_sender(scenario, nft);
        };

        test_scenario::end(scenario_val);
    }

    #[test]
    fun test_withdraw_sales_success_sale_balance_zero() {
        let module_owner = @0xa;

        let scenario_val = test_scenario::begin(module_owner);
        let scenario = &mut scenario_val;

        {
            init(test_scenario::ctx(scenario));
        };

        test_scenario::next_tx(scenario, module_owner);
        
        let expected_sales_amount = 0;
        {
            let minter_cap = test_scenario::take_from_sender<MinterCap>(scenario);

            let sales_coin = withdraw_sales(
                &mut minter_cap,
                test_scenario::ctx(scenario)
            );

            assert_eq(
                coin::value(&sales_coin), 
                expected_sales_amount
            );
            coin::burn_for_testing(sales_coin);

            test_scenario::return_to_sender(scenario, minter_cap);
        };
        let tx = test_scenario::end(scenario_val);
        let expected_events_emitted = 1;
        assert_eq(
            test_scenario::num_user_events(&tx), 
            expected_events_emitted
        );
    }

    #[test]
    fun test_withdraw_sales_success_sales_balance_non_zero() {
        let module_owner = @0xa;
        let nft_owner = @0xb;

        let scenario_val = test_scenario::begin(module_owner);
        let scenario = &mut scenario_val;

        {
            init(test_scenario::ctx(scenario));
        };

        test_scenario::next_tx(scenario, module_owner);

        let nft_name = b"test_nft_name_34";
        let nft_description = b"test_nft_description43";
        let nft_image = b"test_nft_image2";
        let payment_amount = 1000000000;
        let change = 0;
        {
            let payment_coin = sui::coin::mint_for_testing<SUI>(
                payment_amount + change,
                test_scenario::ctx(scenario)
            );

            let minter_cap = test_scenario::take_from_sender<MinterCap>(scenario);

            mint_nft(
                nft_owner,
                nft_name,
                nft_description,
                nft_image,
                &mut payment_coin,
                &mut minter_cap,
                test_scenario::ctx(scenario)
            );

            assert_eq(
                coin::value(&payment_coin),
                change
            );
            coin::burn_for_testing(payment_coin);

            test_scenario::return_to_sender(scenario, minter_cap);
        };

        test_scenario::next_tx(scenario, module_owner);
        
        let expected_sales_amount = 1000000000;
        {
            let minter_cap = test_scenario::take_from_sender<MinterCap>(scenario);

            let sales_coin = withdraw_sales(
                &mut minter_cap,
                test_scenario::ctx(scenario)
            );

            assert_eq(
                coin::value(&sales_coin), 
                expected_sales_amount
            );
            coin::burn_for_testing(sales_coin);

            test_scenario::return_to_sender(scenario, minter_cap);
        };
        let tx = test_scenario::end(scenario_val);
        let expected_events_emitted = 1;
        assert_eq(
            test_scenario::num_user_events(&tx), 
            expected_events_emitted
        );
    }
}