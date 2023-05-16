"use strict";

const Router = require("express").Router;
const router = new Router();
const jwt = require("jsonwebtoken");

const { BadRequestError, UnauthorizedError } = require("../expressError");
const User = require("../models/user");
const { SECRET_KEY, JWT_OPTIONS } = require("../config");

/** POST /login: {username, password} => {token} */
router.post("/login", async function (req, res, next) {

  if (req.body === undefined) throw new BadRequestError();

  const { username, password } = req.body;
  if (await User.authenticate(username, password)) {
    const _token = jwt.sign({ username }, SECRET_KEY, JWT_OPTIONS);
    User.updateLoginTimestamp(username);
    return res.json({ _token });
  }
  throw new UnauthorizedError("Invalid user/password");
});

/** POST /register: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 */
router.post("/register", async function (req, res, next) {

  if (req.body === undefined) throw new BadRequestError();

  const { username, password, first_name, last_name, phone } = req.body;
  await User.register({ username, password, first_name, last_name, phone });
  if (await User.authenticate(username, password)) {
    const _token = jwt.sign({ username }, SECRET_KEY, JWT_OPTIONS);
    User.updateLoginTimestamp(username);
    return res.json({ _token });
  }
  throw new UnauthorizedError("Invalid user/password");
});

module.exports = router;