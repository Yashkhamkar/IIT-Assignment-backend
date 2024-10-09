const asyncHandler = require("express-async-handler");
const { generateToken } = require("../utils/generateToken");
const User = require("../models/userModel");

const register = asyncHandler(async (req, res) => {
  const { username, pass, role } = req.body;
  console.log(req.body);
  const userExists = await User.findOne({ username });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }
  try {
    const user = await User.create({
      username,
      pass,
      role,
    });
    return res.status(201).json({
      _id: user._id,
      username: user.username,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(400);
    throw new Error("Error: " + error);
  }
});

const login = asyncHandler(async (req, res) => {
  const { username, pass } = req.body;
  const user = await User.findOne({ username });
  if (user && (await user.matchPassword(pass))) {
    if (user.status === "DELETED") {
      res.status(401);
      throw new Error("Account of this member has been deleted");
    }
    return res.json({
      _id: user._id,
      username: user.username,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid username or password");
  }
});

module.exports = { register, login };
