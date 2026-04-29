'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Send, Upload, X, ImageIcon, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { saveUsage } from '@/lib/history';

export default function UsePocketForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const pocketName = searchParams.get('name') || 'Pocket';
  const pocketBalance = parseFloat(searchParams.get('balance') || '0');
  const pocketAsset = searchParams.get('asset') || 'XLM';
  const pocketColor = searchParams.get('color') || '';

  const [amount, setAmount] = useState(pocketBalance > 0 ? pocketBalance.toFixed(2) : '');
  const [purpose, setPurpose] = useState('');
  const [recipient, setRecipient] = useState('');
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [evidencePreview, setEvidencePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (pocketBalance > 0) {
      setAmount(pocketBalance.toFixed(2));
    }
  }, [pocketBalance]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setEvidenceFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setEvidencePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearEvidence = () => {
    setEvidenceFile(null);
    setEvidencePreview(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('Please enter a valid amount');
      setIsSubmitting(false);
      return;
    }

    if (!purpose.trim()) {
      alert('Please describe the purpose');
      setIsSubmitting(false);
      return;
    }

    if (!recipient.trim()) {
      alert('Please enter a recipient address');
      setIsSubmitting(false);
      return;
    }

    // Save usage record to localStorage
    saveUsage({
      pocketName,
      amount: numAmount,
      asset: pocketAsset,
      purpose: purpose.trim(),
      recipient: recipient.trim(),
      evidence: evidencePreview,
      evidenceName: evidenceFile?.name || null,
      status: 'completed',
    });

    setSubmitted(true);
    setIsSubmitting(false);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-6 text-center py-10"
      >
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto">
          <CheckCircle size={32} className="text-emerald-400" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-white">Usage Recorded</h2>
          <p className="text-sm text-gray-400">
            {parseFloat(amount).toFixed(2)} {pocketAsset} marked as used for &quot;{purpose}&quot;{recipient ? ` to ${recipient.substring(0, 6)}...${recipient.substring(recipient.length - 4)}` : ''}
          </p>
        </div>
        <button
          onClick={() => router.push('/?tab=pockets')}
          className="w-full py-3 bg-primary text-dark font-bold rounded-xl hover:opacity-90 transition"
        >
          Back to Pockets
        </button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium mb-2 group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back to Pockets
      </button>

      <div className="glass p-5 rounded-3xl border border-white/5 space-y-3">
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Using Pocket</p>
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${pocketColor}`}>
            <span className="text-lg font-bold capitalize">{pocketName.charAt(0)}</span>
          </div>
          <div>
            <h3 className="font-bold capitalize text-white">{pocketName}</h3>
            <p className="text-sm text-gray-400">
              Available: {pocketBalance.toFixed(2)} <span className="text-[10px] font-bold text-gray-600">{pocketAsset}</span>
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5 ml-1">
              Amount to Use ({pocketAsset})
            </label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full p-3.5 bg-dark border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
              required
            />
            <p className="text-xs text-gray-500 mt-1 ml-1">
              Max available: {pocketBalance.toFixed(2)} {pocketAsset}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5 ml-1">
              Recipient Address
            </label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="G..."
              className="w-full p-3.5 bg-dark border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5 ml-1">
              Purpose / Description
            </label>
            <input
              type="text"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="e.g. Tuition payment, groceries, medicine..."
              className="w-full p-3.5 bg-dark border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5 ml-1">
              Evidence (Optional)
            </label>
            {!evidencePreview ? (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-primary/50 hover:bg-white/5 transition-all">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload size={24} className="text-gray-400 mb-2" />
                  <p className="text-xs text-gray-400">Click to upload receipt or photo</p>
                  <p className="text-[10px] text-gray-600 mt-1">PNG, JPG up to 5MB</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="relative rounded-xl overflow-hidden border border-white/10">
                <img
                  src={evidencePreview}
                  alt="Evidence preview"
                  className="w-full h-48 object-contain bg-dark"
                />
                <button
                  type="button"
                  onClick={clearEvidence}
                  className="absolute top-2 right-2 p-1.5 bg-dark/80 rounded-lg text-gray-400 hover:text-white transition"
                >
                  <X size={14} />
                </button>
                <div className="absolute bottom-2 left-2 flex items-center gap-1.5 px-2 py-1 bg-dark/80 rounded-lg">
                  <ImageIcon size={12} className="text-primary" />
                  <span className="text-[10px] text-gray-300 font-medium">{evidenceFile?.name}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 bg-primary text-dark font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition shadow-lg shadow-primary/20 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-dark border-t-transparent rounded-full animate-spin" />
              Recording Usage...
            </>
          ) : (
            <>
              <Send size={20} /> Record Usage
            </>
          )}
        </button>
      </form>
    </div>
  );
}
