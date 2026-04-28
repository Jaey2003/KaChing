import { Horizon, Networks, Asset, TransactionBuilder, Transaction, BASE_FEE, Contract, Address, xdr, SorobanRpc, nativeToScVal } from '@stellar/stellar-sdk';
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
  pockets: { name: string; percentage: number; recipient: string }[],
  assetCode: string,
  overrideContractId?: string
) {
  const publicKey = sessionStorage.getItem('kaChing_user');
  if (!publicKey) throw new Error('User not connected');

  const finalContractId = overrideContractId || contractId;
  if (!finalContractId) throw new Error('No contract ID available');

  // Testnet Token Contract IDs
  const TOKEN_ADDRESSES: Record<string, string> = {
    'XLM': 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC', // Official Testnet Native XLM Contract
    'USDC': 'CCW67Z6S5QYOKU62XNQT2Y2K7XPFIDY7P3HL66T5IJRPHX6V6Z7K7YVQ' // Placeholder: Replace with actual USDC Contract ID if available
  };

  const tokenAddress = TOKEN_ADDRESSES[assetCode.toUpperCase()] || TOKEN_ADDRESSES['XLM'];

  const contract = new Contract(finalContractId);
  const account = await server.loadAccount(publicKey);

  const tx = new TransactionBuilder(account, { fee: BASE_FEE, networkPassphrase })
    .addOperation(contract.call(
      'process_split',
      new Address(publicKey).toScVal(),
      new Address(tokenAddress).toScVal(),
      // Explicitly construct i128 to match contract expectations
      xdr.ScVal.scvI128(new xdr.Int128Parts({
        hi: xdr.Int64.fromString("0"),
        lo: xdr.Uint64.fromString(Math.floor(amount * 10_000_000).toString())
      })),
      // Explicitly construct Vec of Maps with Symbol, u32, and Address
      xdr.ScVal.scvVec(pockets.map(p => xdr.ScVal.scvMap([
        new xdr.ScMapEntry({
          key: xdr.ScVal.scvSymbol('name'),
          val: xdr.ScVal.scvSymbol(p.name.toLowerCase())
        }),
        new xdr.ScMapEntry({
          key: xdr.ScVal.scvSymbol('percentage'),
          val: xdr.ScVal.scvU32(p.percentage)
        }),
        new xdr.ScMapEntry({
          key: xdr.ScVal.scvSymbol('recipient'),
          val: new Address(p.recipient).toScVal()
        })
      ])))
    ))
    .setTimeout(300)
    .build();

  // Prepare transaction (simulates and assembles in one go)
  const preparedTx = await rpcServer.prepareTransaction(tx);
  
  const signedXdr = await signTransaction(preparedTx.toXDR());
  const sendRes = await rpcServer.sendTransaction(TransactionBuilder.fromXDR(signedXdr, networkPassphrase));
  if (sendRes.status === 'ERROR') {
    throw new Error('Transaction submission failed: ' + JSON.stringify(sendRes));
  }

  // Poll for result using Horizon (more stable and avoids CORS/SDK bugs)
  let attempts = 0;
  while (attempts < 60) { // Max 60 seconds
    await new Promise(resolve => setTimeout(resolve, 1000));
    attempts++;
    
    try {
      // Horizon will throw 404 until the transaction is in a ledger
      const txResult = await server.transactions().transaction(sendRes.hash).call();
      if (txResult) {
        console.log('Transaction confirmed on Horizon:', txResult);
        return txResult;
      }
    } catch (e: any) {
      // If 404, transaction isn't in ledger yet, just keep polling
      if (e.response?.status !== 404) {
        console.warn('Polling Horizon failed, retrying...', e.message);
      }
    }
  }

  throw new Error('Transaction polling timed out. Your balance was deducted, so the transaction likely succeeded. Check your wallet history!');

  return { status };
}
