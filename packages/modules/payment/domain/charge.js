function chargeCard(stripe, payload) {
  return stripe.paymentIntents.create(payload);
}

module.exports = { chargeCard };
