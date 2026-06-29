const express = require("express");
const cors = require("cors");

const config = require("@app/shared-config");
const db = require("@app/shared-db");
const { bus } = require("@app/shared-events");
const { ModuleRegistry, buildContext, loadModulesFrom } = require("@app/shared-kernel");
const { mountBodyParsers } = require("@app/shared-kernel/body");
const { requestLogger } = require("@app/shared-kernel/requestLogger");
const { errorHandler } = require("@app/shared-kernel/errorHandler");
const { consoleLogRequestBody } = require("@app/shared-events/logger");

function mountCors(app) {
  app.use(cors());
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
    next();
  });
}

const app = express();

mountBodyParsers(app);
mountCors(app);

app.use((req, res, next) => {
  requestLogger(req, res, () => {
    consoleLogRequestBody(req);
    next();
  });
});

const registry = new ModuleRegistry();
const ctx = buildContext(registry, db, bus, config);

const discovered = loadModulesFrom(require("path").join(__dirname, "../../../packages/modules"));
for (const { mod } of discovered) {
  const modInstance = mod(ctx);
  registry.register(modInstance);
}

app.get("/", (req, res) => {
  res.json({
    name: "ecommerce-modular-monolith-vuln",
    modules: registry.all().map((m) => m.name),
  });
});

for (const mod of registry.all()) {
  if (typeof mod.routes === "function") {
    mod.routes(app);
  }
}

app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () => {
  console.log(`api listening on :${port} (modules=${registry.all().length})`);
});

module.exports = app;
