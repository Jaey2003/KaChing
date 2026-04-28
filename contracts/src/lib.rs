#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, vec, Address, Env, Vec, Symbol, log};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PocketAllocation {
    pub name: Symbol,
    pub percentage: u32,
}

#[contract]
pub struct KaChing;

#[contractimpl]
impl KaChing {
    /// Core MVP: Validates split percentages and calculates pocket allocations.
    pub fn process_split(
        env: Env,
        sender: Address,
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

        // Emit event or log for successful split
        log!(&env, "Split processed for amount: {}", total_amount);
        
        true
    }
}