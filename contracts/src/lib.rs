#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, token, Address, Env, Vec, Symbol, log};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PocketAllocation {
    pub name: Symbol,
    pub percentage: u32,
    pub recipient: Address,
}

#[contract]
pub struct KaChing;

#[contractimpl]
impl KaChing {
    /// Core MVP: Validates split percentages and executes real token transfers.
    pub fn process_split(
        env: Env,
        sender: Address,
        token: Address,
        total_amount: i128,
        pockets: Vec<PocketAllocation>,
    ) -> bool {
        sender.require_auth();

        let mut total_percentage: u32 = 0;
        for pocket in pockets.iter() {
            total_percentage += pocket.percentage;
        }

        if total_percentage != 100 {
            panic!("Total percentage must be 100");
        }

        let token_client = token::Client::new(&env, &token);

        for pocket in pockets.iter() {
            let pocket_amount = (total_amount * i128::from(pocket.percentage)) / 100;
            if pocket_amount > 0 {
                token_client.transfer(&sender, &pocket.recipient, &pocket_amount);
                log!(&env, "Transferred {} to {}", pocket_amount, pocket.recipient);
            }
        }
        
        true
    }
}