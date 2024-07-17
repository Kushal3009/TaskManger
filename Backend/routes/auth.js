const express = require("express");
const router = express.Router();
const User = require("../model/User.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const auth = require("../middleware/fetchUser.js");
dotenv.config();
const JWT_SECRET = process.env.JWT_TOKEN;
const { body, validationResult } = require("express-validator");

const ValidationRulesForCreateUser = [
  body("email", "Enter valid Email").isEmail(),
  body("password", "Enter valid Password").isLength({ min: 6 }),
  body("name", "Enter valid Name").isLength({ min: 3 }),
];

const validationForLoginUser = [
  body("email", "Enter Valid Email").isEmail(),
  body("password", "Enter Valid Password").exists(),
];

router.post("/createUser", ValidationRulesForCreateUser, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    // Check if email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    // Hashpassword using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashPassword,
    });
    await newUser.save();

    res.status(201).json({ message: "Add successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.post("/login", validationForLoginUser, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Validation errors:", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    console.log("Login attempt with:", { email, password });
    // console.log(typeof)
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found");
      return res.status(400).json({ error: "Email is Wrong" });
    }

    const compare = await bcrypt.compare(password, user.password);
    if (!compare) {
      console.log("Password does not match");
      return res.status(400).json({ error: "Email or Password is Wrong" });
    }

    const data = { user: { id: user.id } };
    const authToken = jwt.sign(data, JWT_SECRET);
    res.json({ authToken });
  } catch (err) {
    console.error("Server error:", err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/getUser", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;