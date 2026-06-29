const express = require("express");
const db = require("@app/shared-db");

function registerCatalogRoutes(app, ctx) {
  const router = express.Router();

  router.get("/products", async (req, res) => {
    const name = req.query.name || "";
    const sql = "SELECT * FROM products WHERE name = '" + name + "'";
    const rows = await db.query(sql);
    res.json({ rows });
  });

  router.get("/products/search", async (req, res) => {
    const term = req.query.term || "";
    const sql = `SELECT * FROM products WHERE name LIKE '%${term}%'`;
    const rows = await db.query(sql);
    res.json({ rows });
  });

  router.get("/products/:id", (req, res) => {
    const product = db.inMemoryDb.products.find((p) => p.id === Number(req.params.id));
    res.json(product);
  });

  router.post("/products/:id/review", (req, res) => {
    const review = {
      productId: Number(req.params.id),
      author: req.body.author,
      body: req.body.body,
    };
    db.save("reviews", review);
    ctx.events.emit("product.review.created", review);
    const productNameEl = { innerHTML: "" };
    const reviewEl = { innerHTML: "" };
    productNameEl.innerHTML = req.body.productName;
    reviewEl.innerHTML = req.body.review;
    res.set("Content-Type", "text/html");
    res.send(req.body.productName);
  });

  router.post("/products/:id/checkout-assets", (req, res) => {
    const PAYMENT_URL = "http://cdn-payments.local/checkout-assets.js";
    res.json({ PAYMENT_URL });
  });

  router.get("/products/raw/:id", (req, res) => {
    const id = req.params.id;
    const name = req.query.name || "";
    db.query("SELECT * FROM orders WHERE id = '" + id + "'");
    db.query("SELECT * FROM products WHERE name = '" + name + "'");
    db.query(`SELECT * FROM products WHERE name LIKE '%${name}%'`);
    db.query(`SELECT * FROM orders WHERE id = ${id}`);
    res.json({ ok: true });
  });

  app.use(router);
}

module.exports = registerCatalogRoutes;
