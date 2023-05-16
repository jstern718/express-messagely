"use strict";

/** Middleware for handling req authorization for routes. */

const jwt = require("jsonwebtoken");

const { SECRET_KEY } = require("../config");
const { UnauthorizedError } = require("../expressError");
const Message = require("../models/message");


/** Middleware: Authenticate user. */

function authenticateJWT(req, res, next) {
  try {
    const tokenFromRequest = req.query._token || req.body._token;
    const payload = jwt.verify(tokenFromRequest, SECRET_KEY);
    res.locals.user = payload;
    return next();
  } catch (err) {
    // error in this middleware isn't error -- continue on
    return next();
  }
}

/** Middleware: Requires user is authenticated. */

function ensureLoggedIn(req, res, next) {
  const user = res.locals.user;
  if (user && user.username) {
    return next();
  }
  throw new UnauthorizedError();
}

/** Middleware: Requires user is user for route. */

function ensureCorrectUser(req, res, next) {
  const currentUser = res.locals.user;
  const hasUnauthorizedUsername = currentUser?.username !== req.params.username;

  if (!currentUser || hasUnauthorizedUsername) {
    throw new UnauthorizedError();
  }
  return next();
}

/** Middleware: Requires user is either the same user as on the to or from message user*/
async function ensureToOrFromMessageId(req, res, next) {
  const currentUser = res.locals.user;
  const message = await Message.get(req.params.id);

  const isAuthorizedUser = message?.from_user.username === currentUser?.username ||
    message?.to_user.username === currentUser?.username ? true : false;

  if (currentUser && isAuthorizedUser) {
    return next();
  }
  throw new UnauthorizedError();
}

/** Middleware: Requires user is recipient of message*/
async function ensureRecipient(req, res, next) {
  console.log("ensureRecipient runs.......")
  const currentUser = res.locals.user;
  const message = await Message.get(req.params.id);

  const isRecipient = message?.to_user.username === currentUser?.username ? true : false;
  console.log("isRecipient.......", isRecipient, message)
  if (currentUser && isRecipient) {
    return next();
  }
  throw new UnauthorizedError();
}


module.exports = {
  authenticateJWT,
  ensureLoggedIn,
  ensureCorrectUser,
  ensureToOrFromMessageId,
  ensureRecipient,
};
