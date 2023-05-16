"use strict";

const Router = require("express").Router;
const router = new Router();
const User = require("../models/user");

const { ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth");

const { use } = require("bcrypt/promises");

/** GET / - get list of users.
 *
 * => {users: [{username, first_name, last_name}, ...]}
 *
 **/

router.get("/", ensureLoggedIn, async function (req, res, next) {

    const allUsers = await User.all();
    return res.json({ users: allUsers });
});

/** GET /:username - get detail of users.
 *
 * => {user: {username, first_name, last_name, phone, join_at, last_login_at}}
 *
 **/
//TODO: remove ensureLoggedIn in Routes
router.get("/:username", ensureLoggedIn, ensureCorrectUser, async function (req, res, next) {
    const { username } = req.params;

    const user = await User.get(username);
    return res.json({ user });
});

/** GET /:username/to - get messages to user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 from_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/
router.get("/:username/to", ensureLoggedIn, ensureCorrectUser, async function (req, res, next) {
    const { username } = req.params;

    const messages = await User.messagesTo(username);
    return res.json({ messages });
});


/** GET /:username/from - get messages from user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 to_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/
router.get("/:username/from", ensureLoggedIn, ensureCorrectUser, async function (req, res, next) {
    const { username } = req.params;

    const messages = await User.messagesFrom(username);
    return res.json({ messages });
});

/** Get /passwordChange: Sends 6 digit code for password change.
 *
 * returns JSON {code}.
 */
router.get("/:username/passwordChange", async function (req, res, next) {
    const { username } = req.params;

    const user = await User.get(username);
    const code = Math.floor(100000 + Math.random() * 900000);
});

module.exports = router;