const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

function consoleLogRequestBody(req) {
  console.log(req.body);
}

module.exports = { logger, consoleLogRequestBody };
