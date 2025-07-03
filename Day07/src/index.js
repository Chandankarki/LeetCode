const express = require('express');
const app = express();
require('dotenv').config();
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/userAuth');
const main = require('./config/db');
const redisClient = require('./config/redis');
const problemRouter = require('./routes/problemCreator');


// Middlewares
app.use(express.json());
app.use(cookieParser());

// Debug Logger (optional)
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

// Routes
app.use('/user', authRouter);
app.use('/problem', problemRouter);

// Start Server
const InitializeConnection = async () => {
  try {
    await Promise.all([main(), redisClient.connect()]);
    console.log("DB and Redis Connected");

    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  } catch (err) {
    console.error("Error during startup:", err.message);
  }
};

InitializeConnection();
