# KaChing
*Hear the savings. Split with purpose.* – A fee-optimized remittance router with auto-budgeting pockets for OFW families, powered by Stellar Soroban.

## 🎯 Problem & Solution
**Problem:** Philippine remittances hit $35.63B in 2025, yet 43% of senders cite hidden fees as their top frustration. The PH Senate's OFW Remittance Protection Act warns that "such costs diminish OFW income" and mandates transparency. Families receiving irregular inflows struggle to allocate funds toward tuition, medical, and savings, causing cash leakage.

**Solution:** KaChing compares real-time anchor fees on Stellar, executes USDC transfers via Freighter, and uses a Soroban contract to auto-split arriving funds into labeled pockets (tuition/savings/medical). Each split is validated against a 2% regulatory fee cap, with a real-time compliance audit trail.

## 📅 4-Day MVP Timeline
- **Day 1:** Soroban split logic + fee-cap validation + testnet deployment
- **Day 2:** Next.js frontend + Freighter wallet auth + Horizon TX builder
- **Day 3:** Auto-split UI routing + Ka-Ching audio trigger + mock anchor quotes
- **Day 4:** Mobile polish + error states + 90s demo recording + submission

## 🌌 Stellar Features Used
- `USDC transfers` (fast, low-cost cross-border settlement)
- `Custom tokens` (mock PHP_TUITION, PHP_SAVINGS, PHP_MEDICAL assets)
- `Soroban smart contracts` (programmatic % split + regulatory fee validation)
- `Built-in DEX` (future routing via existing order books for FX optimization)
- `Trustlines` (auto-established for pocket assets on receiver side)

## 🚀 Vision & Purpose
Transform remittance from a one-off cash drop into a structured financial pipeline. By combining fee transparency, programmable budgeting, and local anchor integration, KaChing empowers migrant workers to protect their hard-earned income and helps receiving families build long-term stability.

## 🛠️ Prerequisites
- Rust 1.70+ (`rustup update stable`)
- Soroban CLI v21.0.0+ (`cargo install --locked soroban-cli`)
- Node.js 18+ (for frontend integration)

## 🏗️ How to Build
```bash
soroban contract build
# Output: target/wasm32-unknown-unknown/release/ka_ching.wasm