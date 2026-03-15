const test = require('node:test');
const assert = require('node:assert/strict');

const { createPurchase } = require('../backend/payment');

test('createPurchase returns stripe checkout details', () => {
  const result = createPurchase({ amount: 10, paymentMethod: 'stripe' });

  assert.equal(result.status, 200);
  assert.equal(result.purchase.provider, 'stripe');
  assert.match(result.purchase.checkoutUrl, /amount=10/);
});

test('createPurchase returns e-transfer instructions', () => {
  const result = createPurchase({ amount: 10, paymentMethod: 'etransfer' });

  assert.equal(result.status, 200);
  assert.equal(result.purchase.provider, 'etransfer');
  assert.match(result.purchase.instructions, /e-transfer/i);
});

test('createPurchase rejects invalid amounts', () => {
  const result = createPurchase({ amount: 0, paymentMethod: 'stripe' });

  assert.equal(result.status, 400);
  assert.equal(result.error, 'amount must be a positive number');
});
