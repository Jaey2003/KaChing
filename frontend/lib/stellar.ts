import { Server, Networks, Asset, TransactionBuilder, BASE_FEE } from '@stellar/stellar-sdk';
import * as Freighter from '@stellar/freighter-api';

const networkPassphrase = Networks.TESTNET;
const horizonUrl = process.env.NEXT_PUBLIC_HORIZON_URL || 'https://horizon-testnet.stellar.org';

export const server = new Server(horizonUrl, { allowHttp: true });

export async function connectWallet(): Promise<string | null> {
  try {
    const isAllowed = await Freighter.isAllowed();
    if (!isAllowed) {
      alert('Please install Freighter wallet');
      return null;
    }
    
    const publicKey = await Freighter.getPublicKey();
    return publicKey;
  } catch (error) {
    console.error('Wallet connection error:', error);
    return null;
  }
}

export async function signTransaction(txXdr: string): Promise<string> {
  const signed = await Freighter.signTransaction(txXdr, {
    networkPassphrase,
  });
  return signed.signedTxXdr;
}

export async function submitTransaction(signedXdr: string) {
  const transaction = TransactionBuilder.fromXDR(signedXdr, networkPassphrase);
  return await server.submitTransaction(transaction);
}