const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const { ensureCorrectUser, ensureLoggedIn } = require("../middleware/auth");

// GET /users
router.get("", ensureLoggedIn, async (req, res, next) => {
  try {
    const userData = await db.query("SELECT * FROM users");
    return res.json(userData.rows);
  } catch (err) {
    return next(err);
  }
});

// POST /users
router.post("", async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = await db.query(
      "INSERT INTO users (username,password) VALUES ($1,$2) RETURNING *",
      [req.body.username, hashedPassword]
    );
    delete newUser.rows[0].password;
    // respond with the newly created user!
    return res.json(newUser.rows[0]);
  } catch (err) {
    return next(err);
  }
  // What happens if you try add a user with a username that already exists?
});

// POST /users/auth
// http POST localhost:3000/users/auth username=elie password=secret

router.post("/auth", async (req, res, next) => {
  // 1 - check and see if the username exists in the database
  const foundUser = await db.query("SELECT * FROM users WHERE username=$1", [
    req.body.username
  ]);
  // 2 - if not
  if (foundUser.rows.length === 0) {
    return res.json({ message: "Invalid Username" });
  }
  // check to see if the password specified is the same as the one in the DB
  const result = await bcrypt.compare(
    req.body.password,
    foundUser.rows[0].password
  );
  // 4 - if not
  if (result === false) {
    return res.json({ message: "Invalid Password" });
  } else {
    const token = jsonwebtoken.sign(
      {
        user_id: foundUser.rows[0].id,
        hello: "Woohoo!"
      },
      "SECRET"
    );
    return res.json({ token });
  }
});

// http localhost:3000/users/secret

// 1 -  sending a JWT to the server! ----> "Authorization": "TOKEN"

router.get("/secret", ensureLoggedIn, (req, res, next) => {
  return res.json({
    message: "You made it!"
  });
});

router.get("/protected", ensureLoggedIn, (req, res, next) => {
  return res.json({
    message: "Good job!"
  });
});

// /users/secure/10 ---->
router.get("/secure/:id", ensureCorrectUser, (req, res, next) => {
  return res.json({
    message: "You made it!"
  });
});

module.exports = router;
