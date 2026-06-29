const orders = require("../routes/orders");
const totals = require("../domain/totals");

function moduleLoader(ctx) {
  return {
    name: "checkout",
    version: "1.0.0",
    services: { calculateTotal: totals.calculateTotal },
    emits: ["order.created"],
    listens: ["cart.created"],
    routes: (app) => orders(app, ctx),
  };
}

module.exports = moduleLoader;
