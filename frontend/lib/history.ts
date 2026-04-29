export interface Transaction {
  id: string;
  type: 'direct' | 'pockets';
  direction: 'sent' | 'received';
  amount: number;
  asset: string;
  timestamp: number;
  recipient?: string;
  pockets?: { name: string; percentage: number; amount: number; recipient?: string }[];
  status: 'completed' | 'pending' | 'failed';
  fee: number;
  anchor: string;
}

const STORAGE_KEY = 'kaChing_transactions';

export function saveTransaction(tx: Omit<Transaction, 'id' | 'timestamp'>) {
  if (typeof window === 'undefined') return;
  
  const history = getTransactions();
  const newTx: Transaction = {
    ...tx,
    direction: 'sent', // Locally saved transactions are always sent by the user
    id: Math.random().toString(36).substring(2, 15).toUpperCase(),
    timestamp: Date.now(),
  };
  
  const updatedHistory = [newTx, ...history];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory.slice(0, 50))); // Keep last 50
  return newTx;
}

export function getTransactions(): Transaction[] {
  if (typeof window === 'undefined') return [];
  
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error('Failed to parse transaction history', e);
    return [];
  }
}
