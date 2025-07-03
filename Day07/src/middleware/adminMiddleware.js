const jwt = require("jsonwebtoken");
const User = require("../models/user");
const redisClient = require("../config/redis");

const adminMiddleware = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) throw new Error("Token is required");

    const payload = jwt.verify(token, process.env.JWT_KEY);
    const user = await User.findOne({ _id: payload._id });

    if(payload.role!=='admin') {
        throw new Error("You are not an admin");
    }

    // const user = await User.findOne({ _id: payload._id });
    if (!user) throw new Error("User not found");

    if (!redisClient.isOpen) await redisClient.connect();
    const isBlocked = await redisClient.exists(`token:${token}`);
    if (isBlocked) throw new Error("Token is blocked");

    req.result = user;
    next();

  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

module.exports = adminMiddleware;
