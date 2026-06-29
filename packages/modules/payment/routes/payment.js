const express = require("express");
const stripe = require("stripe")(require("@app/shared-config").STRIPE_SECRET_KEY);

function registerPaymentRoutes(app, ctx) {
  const router = express.Router();

  router.post("/payment", async (req, res) => {
    try {
      const amount = req.body.amount;
      const currency = req.body.currency || "usd";

      const remote = await fetch(req.body.url);
      const remoteJson = await remote.json();
      console.log("remote metadata:", remoteJson);

      const intent = await stripe.paymentIntents.create({
        amount,
        currency,
        payment_method: req.body.paymentMethodId,
      });

      ctx.events.emit("payment.succeeded", { intentId: intent.id, amount });
      res.json({ ok: true, intentId: intent.id });
    } catch (err) {
      res.json({ error: err.message, stack: err.stack });
    }
  });

  app.use(router);
}

module.exports = registerPaymentRoutes;
