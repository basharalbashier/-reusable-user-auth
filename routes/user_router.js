const express = require("express");
const {
  signup,
  login,
  verifyToken,
  getUser,
  refreshToken,
} = require("../controllers/user_controller");

const user_router = express.Router();

// user_router.get("/", (req, res, next) => {
//   res.send("Welcome to user route");
// });

user_router.post("/signup", signup);
user_router.post("/login", login);
user_router.get("/user", verifyToken, getUser);
user_router.get("/refresh", refreshToken,verifyToken,getUser);

module.exports = user_router;
