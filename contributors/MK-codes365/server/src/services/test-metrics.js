const { calculateMonthlySpend } = require('./subscriptionMetrics');

const testSubscriptions = [
  { name: 'Netflix', price: 499, billingCycle: 'monthly', active: true },
  { name: 'Adobe', price: 12000, billingCycle: 'yearly', active: true },
  { name: 'Hosting', price: 10, billingCycle: 'monthly', active: false }, // Inactive, should be ignored
  { name: 'Gym', price: 50, billingCycle: 'weekly', active: true }, // Weekly: (50 * 52) / 12 = 216.67
  { name: 'Invalid', price: NaN, billingCycle: 'monthly', active: true }, // Invalid price, should be ignored
];

console.log('--- SubSentry Metrics Test ---');
const monthlySpend = calculateMonthlySpend(testSubscriptions);

console.log('Test Data:');
testSubscriptions.forEach(sub => {
  console.log(`- ${sub.name}: ${sub.price} (${sub.billingCycle}) [Active: ${sub.active}]`);
});

console.log('\nExpected Calculation:');
console.log('499 (Netflix) + (12000 / 12) (Adobe) + (50 * 52 / 12) (Gym) = 499 + 1000 + 216.67 = 1715.67');

console.log('\nResult:');
console.log(`Computed Monthly Spend: ${monthlySpend}`);

if (monthlySpend === 1715.67) {
  console.log('✅ TEST PASSED');
} else {
  console.log('❌ TEST FAILED');
}
