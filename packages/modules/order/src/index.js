const routes = require("../routes/orders");
const domain = require("../domain/orders");

function moduleLoader(ctx) {
  return {
    name: "order",
    version: "1.0.0",
    services: { findOrder: domain.findOrder, listOrders: domain.listOrders },
    emits: [],
    listens: ["payment.succeeded"],
    routes: (app) => routes(app, ctx),
  };
}

module.exports = moduleLoader;
