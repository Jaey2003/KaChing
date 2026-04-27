import WalletConnect from '@/components/WalletConnect';
import SendForm from '@/components/SendForm';

export default function Home() {
  return (
    <main className="min-h-screen p-6">
      <div className="max-w-md mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-primary">KaChing</h1>
          <p className="text-gray-400">Hear the savings. Split with purpose.</p>
        </div>
        
        <WalletConnect />
        
        <div className="glass p-6 rounded-xl">
          <SendForm />
        </div>
      </div>
    </main>
  );
}