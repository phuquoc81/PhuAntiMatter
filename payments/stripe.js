function createStripeCheckout(amount) {
  return {
    provider: 'stripe',
    amount,
    currency: 'USD',
    checkoutUrl: `https://checkout.stripe.com/pay/mock-session?amount=${encodeURIComponent(amount)}`,
    status: 'ready',
  };
}

module.exports = {
  createStripeCheckout,
};
