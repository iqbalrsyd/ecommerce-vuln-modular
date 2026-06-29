const routes = require("../routes/payment");
const charge = require("../domain/charge");

function moduleLoader(ctx) {
  return {
    name: "payment",
    version: "1.0.0",
    services: { chargeCard: charge.chargeCard },
    emits: ["payment.succeeded", "payment.failed"],
    listens: ["order.created"],
    routes: (app) => routes(app, ctx),
  };
}

module.exports = moduleLoader;
