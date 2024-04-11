module addrx::stake {
    use sui::object::{Self,UID};
    use sui::transfer;
    use sui::tx_context::{Self,TxContext};
    use sui::coin::{Self,Coin};
    use sui::balance::{Self,Balance};
    use sui::sui::SUI;
    use sui::event;

    const ENOtFundOWner: u64 = 1;

    struct Fund has key {
        id: UID,
        creator: address,
        raised: Balance<SUI>,
    }

    struct FundDepositedEvent has copy,drop {
        value: u64,
    }

    struct FundWithdrawnEvent has copy,drop {
        value: u64,
    }


    fun init(ctx: &mut TxContext){
        let fund = Fund{
            id: object::new(ctx),
            creator : tx_context::sender(ctx),
            raised: balance::zero(),
        };
        transfer::share_object(fund);
    }

    public entry fun stake(fund: &mut Fund,amount: Coin<SUI>) {
        let coin_amount = coin::value(&amount);
    
        let coin_balance = coin::into_balance(amount);
        balance::join(&mut fund.raised,coin_balance);

        event::emit(FundDepositedEvent {
         value: coin_amount
     });

    }

    public entry fun withdraw(fund: &mut Fund , ctx: &mut TxContext) {
        let sender = tx_context::sender(ctx);
        assert!(fund.creator == sender,ENOtFundOWner);
        let amount = balance::value(&fund.raised);
        let raised =  coin::take(&mut fund.raised,amount ,ctx);
        transfer::public_transfer(raised,sender);

        event::emit(FundWithdrawnEvent {
            value: amount,
        });

    }

    public fun amount_raised(fund: &Fund): u64 {
        let value = balance::value(&fund.raised);
        value
    }


}