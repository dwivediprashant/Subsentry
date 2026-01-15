// Helper to normalize prices to monthly
const getMonthlyAmount = (sub) => {
  if (!sub || !sub.price || isNaN(sub.price)) return 0;

  const { price, billingCycle, active } = sub;

  // Only count if sub is active
  if (active === false) return 0;

  switch (billingCycle) {
    case 'monthly':
      return price;
    case 'yearly':
      return price / 12;
    case 'weekly':
      return (price * 52) / 12;
    default:
      return 0;
  }
};

// Sum up all active subs to get the monthly burn
const calculateMonthlySpend = (subs) => {
  if (!Array.isArray(subs) || subs.length === 0) return 0;

  const total = subs.reduce((acc, current) => {
    return acc + getMonthlyAmount(current);
  }, 0);

  return parseFloat(total.toFixed(2));
};

module.exports = {
  getMonthlyAmount,
  calculateMonthlySpend,
};
