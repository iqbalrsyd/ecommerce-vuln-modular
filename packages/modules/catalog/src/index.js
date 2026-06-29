const routes = require("../routes/products");
const domain = require("../domain/catalog");

function moduleLoader(ctx) {
  return {
    name: "catalog",
    version: "1.0.0",
    services: { listProducts: domain.listProducts, addReview: domain.addReview },
    emits: ["product.review.created"],
    listens: [],
    routes: (app) => routes(app, ctx),
  };
}

module.exports = moduleLoader;
