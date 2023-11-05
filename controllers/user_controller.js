const User = require("../modules/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = "Kjosa8wennknewewfnnj0Hodoosa";

const signUp = async (req, res, next) => {
  if (!req.body.name || !req.body.email || !req.body.password) {
    return res.status(400).json({ massage: `Inavalid date` });
  }
  let { name, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password);

  const user = new User({
    name,
    email,
    password: hashedPassword,
  });
  let isUserExist;

  try {
    isUserExist = await User.findOne({ email: email });
  } catch (e) {
    console.log(e);
  }
  if (!isUserExist) {
    try {
      await user.save();
    } catch (e) {
      return res.status(500).json({ message: "Server error" });
    }

    return res
      .status(201)
      .json({ massage: `Successfully created `, body: user });
  }
  return res
    .status(400)
    .json({ massage: `User with the email => ${email} already exists` });
};

const login = async (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ massage: `Invalid date` });
  }
  let { email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (e) {
    console.log(e);
  }
  if (!existingUser) {
    return res
      .status(400)
      .json({ massage: `User with the email => ${email} is not exists` });
  }
  const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
  if (!isPasswordCorrect) {
    return res.status(400).json({ massage: `Invalid email and password` });
  }
  const token = jwt.sign({ id: existingUser._id }, JWT_SECRET_KEY, {
    expiresIn: "30s",
  });
  res.cookie(String(existingUser._id), token, {
    path: "/",
    expires: new Date(Date.now() + 1000 * 30),
    httpOnly: true,
    sameSite: "lax",
  });
  return res
    .status(200)
    .json({ massage: `Successfully logged In`, user: existingUser });
};

const verifyToken = (req, res, next) => {
  const cookie = req.headers.cookie;

  // this token index might be deferent from browser to another, and I am working on Thunder client extension on vc-code
  const token = cookie.split("=")[2];

  /*  if you prefer using direct token uncomment these lines and comment above lines
         // const headers = req.headers["authorization"];
         // const token = headers.split(" ")[1];

         */
  if (!token) {
    return res.status(404).json({ massage: `No token provided` });
  }
  jwt.verify(String(token), JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(200).json({ massage: "Invalid Token" });
    }
    // console.log(user.id);
    req.id = user.id;
  });
  next();
};

const getUser = async (req, res, next) => {
  const userId = req.id;
  let user;
  try {
    user = await User.findById(userId, "-password");
  } catch (e) {
    return new Error(e);
  }
  if (!user) {
    return res.status(404).json({ massage: `No user found` });
  }
  return res.status(200).json({ user });
};

const refreshToken = async (req, res, next) => {
  const cookies = req.headers.cookie;
  const prevToken = cookies.split("=")[2];

  if (!prevToken) {
    return res.status(400).json({ message: "No token found !" });
  }
  jwt.verify(String(prevToken), JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Authentication failed" });
    }
    res.clearCookie(`${user.id}`);
    req.cookies[`${user.id}`] = "";
    const token = jwt.sign({ id: user.id }, JWT_SECRET_KEY, {
      expiresIn: "30",
    });
    res.cookie(String(user.id), token, {
      path: "/",
      expires: new Date(Date.now() + 1000 * 30),
      httpOnly: true,
      sameSite: "lax",
    });
    req.id = user.id;
    next();
  });
};
exports.login = login;
exports.signup = signUp;
exports.verifyToken = verifyToken;
exports.getUser = getUser;
exports.refreshToken = refreshToken;
