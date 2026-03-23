const { createETransferRequest } = require('../payments/etransfer');
const { createStripeCheckout } = require('../payments/stripe');

function createPurchase({ amount, paymentMethod }) {
  if (!Number.isFinite(amount) || amount <= 0) {
    return { error: 'amount must be a positive number', status: 400 };
  }

  if (paymentMethod === 'stripe') {
    return { purchase: createStripeCheckout(amount), status: 200 };
  }

  if (paymentMethod === 'etransfer') {
    return { purchase: createETransferRequest(amount), status: 200 };
  }

  return { error: 'unsupported payment method', status: 400 };
}

function buyTokens(req, res) {
  const amount = Number(req.body?.amount);
  const paymentMethod = req.body?.payment_method || 'stripe';
  const result = createPurchase({ amount, paymentMethod });

  res.writeHead(result.status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(result.purchase || { error: result.error }));
}

module.exports = {
  buyTokens,
  createPurchase,
};
