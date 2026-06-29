const routes = require("../routes/cart");
const domain = require("../domain/cart");

function moduleLoader(ctx) {
  return {
    name: "cart",
    version: "1.0.0",
    services: { findCart: domain.findCart },
    emits: ["cart.created"],
    listens: [],
    routes: (app) => routes(app, ctx),
  };
}

module.exports = moduleLoader;
