const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validate = require('../utils/validator');
const redisClient = require('../config/redis');

const register = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      throw new Error("Request body is empty");
    }

    validate(req.body);
    const { firstName, emailId, password } = req.body;
    req.body.password = await bcrypt.hash(password, 10);
    req.body.role = 'user';

    const user = await User.create(req.body);
    const token = jwt.sign({ _id: user._id, emailId:emailId, role: 'user'}, process.env.JWT_KEY, { expiresIn: 3600 });

    res.cookie("token", token, { maxAge: 3600000, httpOnly: true });
    res.status(200).send("User registered successfully");
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const login = async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!emailId || !password) throw new Error("Email and Password are required");

    const user = await User.findOne({ emailId });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign({ _id: user._id, emailId:emailId, role: user.role }, process.env.JWT_KEY, { expiresIn: 3600 });
    res.cookie("token", token, { maxAge: 3600000, httpOnly: true });
    res.status(200).send("Logged in successfully");
  } catch (err) {
    res.status(401).send(err.message);
  }
};

const logout = async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) throw new Error("Token missing");

    const payload = jwt.decode(token);
    await redisClient.set(`token:${token}`, "BLOCKED");
    await redisClient.expireAt(`token:${token}`, payload.exp);

    res.clearCookie("token");
    res.status(200).send("Logged out successfully");
  } catch (err) {
    res.status(401).send("Error: " + err.message);
  }
};

const adminRegister = async(req, res)=>{
    try {
    if (!req.body || Object.keys(req.body).length === 0) {
      throw new Error("Request body is empty");
    }

    validate(req.body);
    const { firstName, emailId, password } = req.body;
    req.body.password = await bcrypt.hash(password, 10);
    req.body.role = 'admin';

    const user = await User.create(req.body);
    const token = jwt.sign({ _id: user._id, emailId:emailId, role: 'user'}, process.env.JWT_KEY, { expiresIn: 3600 });

    res.cookie("token", token, { maxAge: 3600000, httpOnly: true });
    res.status(200).send("User registered successfully");
  } catch (err) {
    res.status(400).send(err.message);
  }
}


module.exports = { register, login, logout, adminRegister };