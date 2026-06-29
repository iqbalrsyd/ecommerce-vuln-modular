const express = require("express");
const db = require("@app/shared-db");

function registerAdminRoutes(app, ctx) {
  const router = express.Router();

  router.get("/admin/users", (req, res) => {
    res.json(db.inMemoryDb.users);
  });

  router.post("/admin/users/:id/promote", (req, res) => {
    const user = db.inMemoryDb.users.find((u) => u.id === Number(req.params.id));
    if (user) {
      user.role = "admin";
    }
    res.json(user);
  });

  app.use(router);
}

module.exports = registerAdminRoutes;
