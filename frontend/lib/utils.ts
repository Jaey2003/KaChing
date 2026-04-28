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
    { id: 'sdf_test', name: 'Stellar Test Anchor (SDF)', feePct: 0.1, fixed: 0, eta: 1, domain: 'testanchor.stellar.org' },
    { id: 'moneygram', name: 'MoneyGram Access', feePct: 0.0, fixed: 0, eta: 5, domain: 'moneygram.com' },
    { id: 'coinsph', name: 'Coins.ph', feePct: 0.8, fixed: 0, eta: 2, domain: 'coins.ph' },
  ].map(anchor => {
    const fee = Math.max(anchor.fixed, (amount * anchor.feePct) / 100);
    return { ...anchor, totalFee: fee, totalCost: amount + fee };
  }).sort((a, b) => a.totalCost - b.totalCost);
}