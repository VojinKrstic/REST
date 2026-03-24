const express = require("express");
const { body } = require("express-validator");
const User = require("../models/user");

const router = express.Router();
const authController = require("../controllers/auth");
const isAuth = require("../middleware/is-auth");

router.put(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((value) => {
        return User.findOne({ email: value })
          .then((userDoc) => {
            if (userDoc) {
              return Promise.reject("Email already exists.");
            }
          })
          .catch((err) => {
            if (!err.statusCode) {
              err.statusCode = 500;
            }
            next(err);
          });
      })
      .normalizeEmail(),
    body("password").trim().isLength({ min: 5 }),
    body("name").trim().not().isEmpty(),
  ],
  authController.signup,
);

router.post("/login", authController.login);

router.get("/status", isAuth, authController.getStatus);

router.patch(
  "/status",
  isAuth,
  [body("status").trim().notEmpty()],
  authController.updateStatus,
);

module.exports = router;
