export function formatAmount(amount: number | bigint, decimals: number = 2): string {
  const num = typeof amount === 'bigint' ? Number(amount) / 10_000_000 : amount;
  return num.toFixed(decimals);
}

export function playKaChingSound() {
  const audio = new Audio('/kaching.mp3');
  audio.volume = 0.5;
  audio.play().catch(console.error);
}

export function mockAnchorQuotes(amount: number) {
  return [
    { id: 'coinsph', name: 'Coins.ph', feePct: 0.8, fixed: 0, eta: 2 },
    { id: 'velo', name: 'Velo', feePct: 1.2, fixed: 0, eta: 1 },
    { id: 'maya', name: 'Maya', feePct: 0.5, fixed: 25, eta: 3 },
  ].map(anchor => {
    const fee = Math.max(anchor.fixed, (amount * anchor.feePct) / 100);
    return { ...anchor, totalFee: fee, totalCost: amount + fee };
  }).sort((a, b) => a.totalCost - b.totalCost);
}