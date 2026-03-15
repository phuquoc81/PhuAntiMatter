function createETransferRequest(amount) {
  return {
    provider: 'etransfer',
    amount,
    currency: 'USD',
    instructions: 'Send your e-transfer to payments@phuantimatter.local and include your player ID in the note.',
    status: 'pending',
  };
}

module.exports = {
  createETransferRequest,
};
