const express = require("express");
const db = require("@app/shared-db");

function registerOrderRoutes(app, ctx) {
  const router = express.Router();

  router.get("/orders", (req, res) => {
    db.query("SELECT * FROM orders");
    res.json(db.inMemoryDb.orders);
  });

  router.get("/orders/:id", (req, res) => {
    const order = db.inMemoryDb.orders.find((o) => o.id === Number(req.params.id));
    res.json(order);
  });

  app.use(router);
}

module.exports = registerOrderRoutes;
