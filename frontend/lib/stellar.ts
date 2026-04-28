import { Horizon, Networks, Asset, TransactionBuilder, BASE_FEE } from '@stellar/stellar-sdk';
import * as Freighter from '@stellar/freighter-api';

declare global {
  interface Window {
    freighter?: any;
  }
}

const networkPassphrase = Networks.TESTNET;
const horizonUrl = process.env.NEXT_PUBLIC_HORIZON_URL || 'https://horizon-testnet.stellar.org';

export const server = new Horizon.Server(horizonUrl, { allowHttp: true });

export async function connectWallet(): Promise<string | null> {
  try {
    // Always request access first to ensure connection
    await Freighter.requestAccess();
    
    // Now get the public key
    const publicKey = await Freighter.getPublicKey();
    
    if (!publicKey || publicKey.length === 0) {
      alert('Could not get wallet address. Please make sure Freighter is unlocked and has an account.');
      return null;
    }
    
    return publicKey;
  } catch (error: any) {
    alert('Could not connect to Freighter. Please install the extension, unlock your wallet, and allow this site.');
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