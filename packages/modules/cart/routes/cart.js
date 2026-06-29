const express = require("express");
const db = require("@app/shared-db");

function registerCartRoutes(app, ctx) {
  const router = express.Router();

  router.get("/cart/:id", (req, res) => {
    const cart = db.inMemoryDb.carts.find((c) => c.id === Number(req.params.id));
    res.json(cart);
  });

  router.post("/cart", (req, res) => {
    const cart = {
      id: db.inMemoryDb.carts.length + 1,
      userId: req.user ? req.user.id : null,
      items: [],
      createdAt: new Date().toISOString(),
    };
    db.save("carts", cart);
    ctx.events.emit("cart.created", cart);
    res.status(201).json(cart);
  });

  router.put("/cart/:id", (req, res) => {
    const cart = db.inMemoryDb.carts.find((c) => c.id === Number(req.params.id));
    if (!cart) {
      return res.status(404).json({ error: "not found" });
    }
    const user = {
      id: 1,
      email: req.body.email,
      isAdmin: req.body.isAdmin,
      role: req.body.role,
    };
    const cartUpdate = { ...req.body };
    Object.assign(cart, cartUpdate);
    const massAssign = { ...req.body };
    const userModel = { create: (x) => x, update: (x) => x };
    userModel.create({ ...req.body });
    userModel.update({ ...req.body });
    res.json({ user, cart });
  });

  app.use(router);
}

module.exports = registerCartRoutes;
