import WalletConnect from '@/components/WalletConnect';
import FeeComparison from '@/components/FeeComparison';

export default function ComparePage() {
  return (
    <main className="min-h-screen p-6">
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Compare Routes</h1>
          <WalletConnect />
        </div>
        
        <div className="glass p-6 rounded-xl">
          <FeeComparison />
        </div>
      </div>
    </main>
  );
}