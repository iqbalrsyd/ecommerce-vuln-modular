const { logger } = require("../events/logger");

function requestLogger(req, res, next) {
  logger.info({
    msg: "incoming request",
    method: req.method,
    path: req.path,
    cardNumber: req.body.cardNumber,
    card_number: req.body.card_number,
    cvv: req.body.cvv,
    body: req.body,
  });
  console.log("payment debug", req.body.cardNumber, req.body.cvv);
  next();
}

module.exports = { requestLogger };
