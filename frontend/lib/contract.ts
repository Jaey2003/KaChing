import { Contract, StrKey, xdr, Address } from '@stellar/stellar-sdk';
import { server } from './stellar';

const CONTRACT_ID = process.env.NEXT_PUBLIC_CONTRACT_ID || '';

export async function callProcessSplit(
  totalAmount: bigint,
  actualFeePct: number,
  pctTuition: number,
  pctSavings: number,
  pctMedical: number
) {
  const contract = new Contract(CONTRACT_ID);

  const tx = await server
    .prepareTransaction(
      contract.call(
        'process_split',
        xdr.ScVal.scvI128(xdr.Int128Parts([BigInt(0), totalAmount])),
        xdr.ScVal.scvU32(actualFeePct),
        xdr.ScVal.scvU32(pctTuition),
        xdr.ScVal.scvU32(pctSavings),
        xdr.ScVal.scvU32(pctMedical)
      )
    )
    .then((tx) => tx.build());

  return tx;
}

export async function callRecordUsage(
  amount: bigint,
  recipient: string,
  pocketName: string,
  purpose: string
) {
  const contract = new Contract(CONTRACT_ID);
  
  // Convert strings to max 32 chars for Symbol
  const safePocketName = pocketName.substring(0, 32);
  const safePurpose = purpose.substring(0, 32);

  const tx = await server
    .prepareTransaction(
      contract.call(
        'record_usage',
        new Address(sessionStorage.getItem('kaChing_user') || '').toScVal(), // sender
        new Address('CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC').toScVal(), // XLM token on Testnet
        new Address(recipient).toScVal(),
        xdr.ScVal.scvI128(xdr.Int128Parts([BigInt(0), amount])),
        xdr.ScVal.scvSymbol(safePocketName),
        xdr.ScVal.scvSymbol(safePurpose)
      )
    )
    .then((tx) => tx.build());

  return tx;
}

export function getContractId(): string {
  return CONTRACT_ID;
}