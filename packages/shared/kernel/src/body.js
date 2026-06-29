const express = require("express");

function mountBodyParsers(app) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
}

module.exports = { mountBodyParsers };
