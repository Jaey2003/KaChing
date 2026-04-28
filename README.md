# 🪙 KaChing
*Hear the savings. Split with purpose.* – A fee-optimized remittance router with auto-budgeting pockets for families, powered by **Stellar Soroban**.

## 🎬 Demo
<div align="center">
  <video src="media/demo.mp4" width="100%" controls></video>
  <p><i>If the video doesn't load, you can find it in the <code>/media</code> folder.</i></p>
</div>

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

### 🏗️ Architecture
The KaChing Smart Contract is built with Rust and optimized for the Soroban runtime. It acts as a trustless router for cross-border funds.

<div align="center">
  <img src="media/smart-contract.png" alt="Smart Contract Architecture" width="100%" />
</div>

### 🔄 Contract Function Flow
The core logic begins once the user initiates a **Direct Transaction** or **Pocket Split** from the frontend:

1. **Transaction Initialization**: The frontend builds a Soroban transaction containing the total amount, the asset type (XLM/USDC), and a vector of recipients (Pockets).
2. **Freighter Signing**: The user reviews and signs the transaction via the Freighter wallet, ensuring full custody and security.
3. **Soroban Invocation**: The signed XDR is submitted to the network, invoking the `process_split` function on the KaChing contract.
4. **Validation & Calculation**: 
   - The contract verifies that the sum of all pocket percentages equals exactly 100%.
   - It performs high-precision arithmetic to calculate the exact stroop/token amount for each recipient.
5. **Atomic Execution**: The contract executes all transfers in a single atomic transaction. Either every recipient receives their funds, or the entire transaction fails, preventing any "lost" money.

## 📜 Smart Contract Deployment
The KaChing core logic is handled by a Soroban smart contract. There are two ways to deploy it:

### 1. Automated Deployment (Development)
The project includes a custom auto-deployment system designed for rapid development.
- **Endpoint**: `POST /api/auto-deploy`
- **Logic**: When triggered, the server automatically recompiles the Rust contract, deploys it to the Testnet using the `dev` identity, and returns the new `Contract ID`.
- **Integration**: The frontend is configured to automatically trigger this if no persistent `NEXT_PUBLIC_CONTRACT_ID` is found in the environment.

### 2. Manual Deployment (Production)
For production or manual testing, use the following Soroban CLI commands:

#### Build the contract:
```bash
soroban contract build
```

#### Deploy to Testnet:
```bash
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/ka_ching.wasm \
  --source dev \
  --network testnet
```

#### Important Configuration:
After deployment, update your `.env.local` file with the generated Contract ID:
```env
NEXT_PUBLIC_CONTRACT_ID=CDRRTP... (your-new-id)
```

## 🌌 Stellar Features Leveraged
- **Soroban Smart Contracts**: Programmatic distribution of funds.
- **Stellar Assets (SAC)**: Interacting with Native (XLM) and Tokenized (USDC) assets.
- **Horizon API**: Fetching account balances and historical transaction data.
- **Atomic Transactions**: Ensuring either all pockets get funded or none do.

---
*Built for the Stellar Soroban Ecosystem.*