
const express = require('express');
const submitRouter = express.Router();
const userMiddleware = require('../middlewares/userMiddleware');
const submitCode = require('../controllers/userSubmission');


submitRouter.post("/submit/:id", userMiddleware, submitCode);