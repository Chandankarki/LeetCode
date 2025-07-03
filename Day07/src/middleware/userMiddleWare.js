const User = require('../models/user');
const redisClient = require('../config/redis');
const jwt = require("jsonwebtoken");

const userMiddleWare = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            throw new Error("Token is required");
        }

        const payload = jwt.verify(token, process.env.JWT_KEY);
        const { _id } = payload;

        if (!_id) {
            throw new Error("User ID missing in token");
        }

        const result = await User.findOne({ _id });
        if (!result) {
            throw new Error("User not found");
        }

        // Ensure Redis is connected
        if (!redisClient.isOpen) {
            await redisClient.connect();
        }

        const isBlocked = await redisClient.exists(`token:${token}`);
        if (isBlocked) {
            throw new Error("Token is blocked");
        }

        req.result = result; // attach user to request
        next();

    } catch (err) {
        console.error("Middleware Error:", err.message);
        res.status(401).json({ error: err.message });
    }
};

module.exports = userMiddleWare;
