const express = require('express');
const problemRouter = express.Router();
const adminMiddleware = require('../middleware/adminMiddleware');
const {createProblem, updateProblem, deleteProblem, getProblemById, getAllProblem} = require('../controllers/userProblem');
const userMiddleWare = require('../middleware/userMiddleWare');



// create API
problemRouter.post("/create", adminMiddleware, createProblem);
problemRouter.put("/update/:id", adminMiddleware, updateProblem);
problemRouter.delete("/delete/:id", adminMiddleware, deleteProblem);


problemRouter.get("/problemById/:id", userMiddleWare, getProblemById);
problemRouter.get("/getAllProblem", userMiddleWare, getAllProblem);
// problemRouter.get("/problemSolvedByUser", userMiddleWare, solvedAllProblembyUser);


module.exports = problemRouter;

// fetch
// update
// delete
