#![cfg(test)]
use super::*;
use soroban_sdk::{Env, testutils::Address as _};

#[test]
fn test_mvp_happy_path() {
    let env = Env::default();
    let contract_id = env.register_contract(None, KaChing);
    let client = KaChingClient::new(&env, &contract_id);

    client.set_fee_cap(&env.current_contract_address(), &2);
    let (t, s, m, compliant) = client.process_split(&100, &1, &50, &30, &20);
    
    assert!(compliant);
    assert_eq!(t, 49);
    assert_eq!(s, 29);
    assert_eq!(m, 21);
}

#[test]
#[should_panic(expected = "Split percentages must sum to 100")]
fn test_invalid_percentages_panic() {
    let env = Env::default();
    let contract_id = env.register_contract(None, KaChing);
    let client = KaChingClient::new(&env, &contract_id);
    client.process_split(&100, &1, &40, &30, &20);
}

#[test]
fn test_default_fee_cap_storage() {
    let env = Env::default();
    let contract_id = env.register_contract(None, KaChing);
    let client = KaChingClient::new(&env, &contract_id);

    let (_, _, _, compliant_exact) = client.process_split(&100, &2, &50, &30, &20);
    assert!(compliant_exact);

    let (_, _, _, compliant_violation) = client.process_split(&100, &3, &50, &30, &20);
    assert!(!compliant_violation);
}

#[test]
fn test_fee_cap_boundary_condition() {
    let env = Env::default();
    let contract_id = env.register_contract(None, KaChing);
    let client = KaChingClient::new(&env, &contract_id);

    client.set_fee_cap(&env.current_contract_address(), &2);
    let (_, _, _, compliant) = client.process_split(&500, &2, &60, &25, &15);
    assert!(compliant);
}

#[test]
fn test_large_amount_precision() {
    let env = Env::default();
    let contract_id = env.register_contract(None, KaChing);
    let client = KaChingClient::new(&env, &contract_id);

    let amount = 1_000_000_i128;
    let (t, s, m, compliant) = client.process_split(&amount, &1, &33, &33, &34);

    let net = amount - (amount * i128::from(1)) / 100;
    let expected_t = (net * 33) / 100;
    let expected_s = (net * 33) / 100;
    let expected_m = net - expected_t - expected_s;

    assert_eq!(t, expected_t);
    assert_eq!(s, expected_s);
    assert_eq!(m, expected_m);
    assert!(compliant);
}