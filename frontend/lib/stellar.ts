import { Horizon, Networks, Asset, TransactionBuilder, BASE_FEE, Contract, Address, xdr, SorobanRpc } from '@stellar/stellar-sdk';
import * as Freighter from '@stellar/freighter-api';

declare global {
  interface Window {
    freighter?: any;
  }
}

const networkPassphrase = Networks.TESTNET;
const horizonUrl = process.env.NEXT_PUBLIC_HORIZON_URL || 'https://horizon-testnet.stellar.org';
const rpcUrl = 'https://soroban-testnet.stellar.org';
const contractId = process.env.NEXT_PUBLIC_CONTRACT_ID;

if (!contractId) {
  console.warn('NEXT_PUBLIC_CONTRACT_ID is not set in environment variables. Contract interactions will fail.');
}

export const server = new Horizon.Server(horizonUrl, { allowHttp: true });
export const rpcServer = new SorobanRpc.Server(rpcUrl, { allowHttp: true });

export async function connectWallet(): Promise<string | null> {
  try {
    await Freighter.requestAccess();
    const publicKey = await Freighter.getPublicKey();
    
    if (!publicKey || publicKey.length === 0) {
      alert('Could not get wallet address. Please make sure Freighter is unlocked.');
      return null;
    }
    
    return publicKey;
  } catch (error: any) {
    alert('Could not connect to Freighter.');
    return null;
  }
}

export async function signTransaction(txXdr: string): Promise<string> {
  const signed = await Freighter.signTransaction(txXdr, {
    networkPassphrase,
  });
  return signed;
}

export async function submitTransaction(signedXdr: string) {
  const transaction = TransactionBuilder.fromXDR(signedXdr, networkPassphrase);
  return await server.submitTransaction(transaction);
}

export interface StellarAsset {
  code: string;
  issuer?: string;
  balance: string;
}

export async function fetchAccountBalance(publicKey: string): Promise<StellarAsset[]> {
  try {
    const account = await server.loadAccount(publicKey);
    return account.balances.map((b: any) => ({
      code: b.asset_type === 'native' ? 'XLM' : b.asset_code,
      issuer: b.asset_issuer,
      balance: b.balance,
    }));
  } catch (error) {
    console.error('Error fetching balances:', error);
    return [];
  }
}

/**
 * Soroban Contract Interaction: process_split
 */
export async function processSplit(
  amount: number,
  pockets: { name: string; percentage: number }[],
  overrideContractId?: string
) {
  const publicKey = sessionStorage.getItem('kaChing_user');
  if (!publicKey) throw new Error('User not connected');

  const finalContractId = overrideContractId || contractId;
  if (!finalContractId) throw new Error('No contract ID available');

  const contract = new Contract(finalContractId);
  const account = await server.loadAccount(publicKey);

  // Convert pockets to ScVal Vec
  const pocketScVals = pockets.map(p => xdr.ScVal.scvMap([
    new xdr.ScMapEntry({
      key: xdr.ScVal.scvSymbol('name'),
      val: xdr.ScVal.scvString(p.name)
    }),
    new xdr.ScMapEntry({
      key: xdr.ScVal.scvSymbol('percentage'),
      val: xdr.ScVal.scvU32(p.percentage)
    })
  ]));

  const tx = new TransactionBuilder(account, { fee: BASE_FEE, networkPassphrase })
    .addOperation(contract.call(
      'process_split',
      new Address(publicKey).toScVal(),
      xdr.ScVal.scvI128(xdr.Int128.fromString((amount * 10_000_000).toString())), // Native units
      xdr.ScVal.scvVec(pocketScVals)
    ))
    .setTimeout(30)
    .build();

  // Simulate to get footprint/fees
  const sim = await rpcServer.simulateTransaction(tx);
  if (SorobanRpc.Api.isSimulationError(sim)) {
    throw new Error('Simulation failed: ' + sim.error);
  }

  const preparedTx = SorobanRpc.assembleTransaction(tx, sim);
  const signedXdr = await Freighter.signTransaction(preparedTx.toXDR(), { networkPassphrase });
  
  const sendRes = await rpcServer.sendTransaction(TransactionBuilder.fromXDR(signedXdr, networkPassphrase));
  if (sendRes.status === 'ERROR') {
    throw new Error('Transaction failed: ' + JSON.stringify(sendRes.errorResultXdr));
  }

  // Poll for result
  let result = await rpcServer.getTransaction(sendRes.hash);
  while (result.status === 'NOT_FOUND') {
    await new Promise(resolve => setTimeout(resolve, 1000));
    result = await rpcServer.getTransaction(sendRes.hash);
  }

  if (result.status === 'FAILED') {
    throw new Error('Transaction failed in polling');
  }

  return result;
}