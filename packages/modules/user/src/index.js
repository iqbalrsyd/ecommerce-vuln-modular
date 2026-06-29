const auth = require("../routes/auth");
const admin = require("../routes/admin");
const domain = require("../domain/user");

function moduleLoader(ctx) {
  return {
    name: "user",
    version: "1.0.0",
    services: { findByEmail: domain.findByEmail },
    emits: ["user.registered", "user.logged_in"],
    listens: [],
    routes: (app) => {
      auth(app, ctx);
      admin(app, ctx);
    },
  };
}

module.exports = moduleLoader;
