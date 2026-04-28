#![no_std]
use soroban_sdk::{contract, contractimpl, Address, Env, Symbol, symbol_short, log};

const FEE_CAP_KEY: Symbol = symbol_short!("FEE_CAP");

#[contract]
pub struct KaChing;

#[contractimpl]
impl KaChing {
    /// Sets the maximum allowable remittance fee percentage.
    /// Maps to PH Senate Bill 2% compliance requirement.
    pub fn set_fee_cap(env: Env, admin: Address, cap_pct: u32) {
        admin.require_auth();
        env.storage().persistent().set(&FEE_CAP_KEY, &cap_pct);
        log!(&env, "Fee cap updated to: {}%", cap_pct);
    }

    /// Core MVP: Validates fee cap & split percentages, calculates pocket allocations.
    /// Returns: (tuition_amount, savings_amount, medical_amount, is_fee_compliant)
    pub fn process_split(
        env: Env,
        total_amount: i128,
        actual_fee_pct: u32,
        pct_tuition: u32,
        pct_savings: u32,
        pct_medical: u32,
    ) -> (i128, i128, i128, bool) {
        assert!(
            pct_tuition + pct_savings + pct_medical == 100,
            "Split percentages must sum to 100"
        );

        let cap_pct: u32 = env
            .storage()
            .persistent()
            .get(&FEE_CAP_KEY)
            .unwrap_or(2);

        let is_compliant = actual_fee_pct <= cap_pct;
        let fee_amount = (total_amount * i128::from(actual_fee_pct)) / 100;
        let net_amount = total_amount - fee_amount;

        let tuition_amt = (net_amount * i128::from(pct_tuition)) / 100;
        let savings_amt = (net_amount * i128::from(pct_savings)) / 100;
        let medical_amt = net_amount - tuition_amt - savings_amt;

        log!(
            &env,
            "Split: T={}, S={}, M={}, Compliant={}",
            tuition_amt,
            savings_amt,
            medical_amt,
            is_compliant
        );

        (tuition_amt, savings_amt, medical_amt, is_compliant)
    }
}