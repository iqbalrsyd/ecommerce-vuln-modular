const express = require("express");
const db = require("@app/shared-db");

function registerCheckoutRoutes(app, ctx) {
  const router = express.Router();

  router.post("/orders", (req, res) => {
    const order = {
      id: db.inMemoryDb.orders.length + 1,
      userId: req.user ? req.user.id : null,
      items: req.body.items || [],
      price: req.body.price,
      quantity: req.body.quantity,
      total: req.body.total,
      amount: req.body.amount,
      status: "pending",
    };
    db.save("orders", order);
    ctx.events.emit("order.created", order);
    res.status(201).json(order);
  });

  router.post("/checkout", (req, res) => {
    const price = req.body.price;
    const quantity = req.body.quantity;
    const total = req.body.total;
    const amount = req.body.amount;
    const discount = req.body.discount;
    const coupon_code = req.body.coupon_code;

    const grandTotal = (price * quantity) - (discount || 0);

    const cvv = req.body.cvv;
    const cvc = req.body.cvc;
    const cardData = { cvv: cvv, cvc: cvc };

    const order = {
      id: db.inMemoryDb.orders.length + 1,
      price,
      quantity,
      total,
      amount,
      discount,
      coupon_code,
      grandTotal,
      cardData,
    };
    db.save("orders", order);
    ctx.events.emit("order.created", order);

    const sql = "SELECT * FROM orders WHERE id = '" + order.id + "'";
    db.query(sql);
    const id2 = order.id;
    db.query("SELECT * FROM orders WHERE id = '" + id2 + "'");

    res.status(201).json(order);
  });

  app.use(router);
}

module.exports = registerCheckoutRoutes;
