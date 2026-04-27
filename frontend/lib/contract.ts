import { Contract, StrKey, xdr } from '@stellar/stellar-sdk';
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

export function getContractId(): string {
  return CONTRACT_ID;
}