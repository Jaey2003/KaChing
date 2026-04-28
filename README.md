# 🪙 KaChing
*Hear the savings. Split with purpose.* – A fee-optimized remittance router with auto-budgeting pockets for families, powered by **Stellar Soroban**.

## 🎯 Problem & Solution
**Problem:** Philippine remittances hit $35.63B in 2025, yet 43% of senders cite hidden fees as their top frustration. The PH Senate's OFW Remittance Protection Act warns that "such costs diminish OFW income" and mandates transparency. Families receiving irregular inflows struggle to allocate funds toward tuition, medical, and savings, causing cash leakage.

**Solution:** KaChing compares real-time anchor fees on Stellar, identifies the cheapest route, and executes transfers. It uses a **Soroban Smart Contract** to automatically split arriving funds into labeled "Financial Pockets" based on user-defined percentages.

## ✨ Key Features
- **Smart Fee Routing**: Scans multiple Stellar Anchors to find the most cost-effective path.
- **Financial Pockets**: Multi-recipient splits executed via a custom Soroban contract (`process_split`).
- **Blockchain History Sync**: Real-time transaction tracking directly from Stellar Horizon with full pagination support.
- **Freighter Integration**: Secure transaction signing using the official Stellar browser wallet.
- **Resilient Polling**: Robust transaction confirmation pipeline that bypasses SDK limitations for high reliability.
- **Premium UX**: High-fidelity glassmorphic interface with micro-animations and "Ka-Ching" audio feedback.

## 🛠️ Technical Stack
- **Smart Contract**: Rust & Soroban (v21+)
- **Frontend**: Next.js 14, Tailwind CSS, Framer Motion
- **Blockchain Interface**: `@stellar/stellar-sdk`, `@stellar/freighter-api`
- **Infrastructure**: Stellar Testnet, Horizon, Soroban RPC

## 🚀 Quick Start

### 1. Prerequisites
- **Stellar Freighter Wallet**: Installed in your browser and set to **Testnet**.
- **Node.js 18+**
- **Rust & Soroban CLI** (for contract development)

### 2. Setup
```bash
# Install dependencies
cd frontend
npm install

# Configure environment
# Create a .env.local file with:
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_RPC_URL=https://soroban-testnet.stellar.org
NEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org
NEXT_PUBLIC_CONTRACT_ID=YOUR_DEPLOYED_CONTRACT_ID
```

### 3. Run Development Server
```bash
npm run dev
```

## 📜 Smart Contract Logic
The core contract (`contracts/src/lib.rs`) manages the `process_split` function:
1. Receives a total amount and a vector of `PocketAllocation` structs.
2. Validates that the total percentage equals 100%.
3. Calculates the exact amount for each recipient based on the percentage.
4. Executes multiple transfers in a single atomic transaction.

## 🌌 Stellar Features Leveraged
- **Soroban Smart Contracts**: Programmatic distribution of funds.
- **Stellar Assets (SAC)**: Interacting with Native (XLM) and Tokenized (USDC) assets.
- **Horizon API**: Fetching account balances and historical transaction data.
- **Atomic Transactions**: Ensuring either all pockets get funded or none do.

---
*Built for the Stellar Soroban Ecosystem.*