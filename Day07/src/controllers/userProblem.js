// const { setDriver } = require('mongoose');
const {getLanguageById, submitBatch, submitToken} = require('../utils/problemUtility');
const Problem = require('../models/problem');

const createProblem = async(req, res) =>{
    const {title, description,tags, visibleTestCases, 
        hiddenTestCases, startCode, referenceSolution, 
        problemCreator } = req.body;

    try{
        for(const {language, completeCode} of referenceSolution) {
            // judge0 ko denge


            // source code:
            // language_id:
            // stdin:
            // expected_output:

            const languageId = getLanguageById(language);

            // batch submission banayenge
            const submissions = visibleTestCases.map((testcase)=>({
                source_code: completeCode,
                language_id: languageId,
                stdin: testcase.input,
                expected_output: testcase.output
            }));


            const submitResult = await submitBatch(submissions);

            const resultToken = submitResult.map((value)=> value.token);

            const testResult = await submitToken(resultToken);

           console.log("Judge0 Test Results:", testResult);

            for(const test of testResult) {
                if(test.status_id != 3) {
                    console.error("One test case failed:", test);
                    return res.status(400).send("Error Occured");
                }
            }

        }


        // we can store it in our database
        await Problem.create({
            ...req.body,
            problemCreator: req.result._id
        });

        res.status(201).send("Problem Saved Successfully");

    }
    catch(err){
        res.status(400).json({ error: err.message, stack: err.stack });
    }
}


const updateProblem = async(req, res) =>{

    const {id} = req.params
    const {title, description,tags, visibleTestCases, 
        hiddenTestCases, startCode, referenceSolution, 
        problemCreator } = req.body;

    try{

        if(!id) {
            return res.status(400).send("Id is required");
        }

        const DsaProblem = await Problem.findByIdAndUpdate(id);
        if(!DsaProblem) {
            res.status(400).send("Problem not found");
        }

        for(const {language, completeCode} of referenceSolution) {
            // judge0 ko denge


            const languageId = getLanguageById(language);

            // batch submission banayenge
            const submissions = visibleTestCases.map((testcase)=>({
                source_code: completeCode,
                language_id: languageId,
                stdin: testcase.input,
                expected_output: testcase.output
            }));


            const submitResult = await submitBatch(submissions);

            const resultToken = submitResult.map((value)=> value.token);

            const testResult = await submitToken(resultToken);

           console.log("Judge0 Test Results:", testResult);

            for(const test of testResult) {
                if(test.status_id != 3) {
                    console.error("One test case failed:", test);
                    return res.status(400).send("Error Occured");
                }
            }

        }


        const newProblem = await Problem.findByIdAndUpdate(id, {...req.body}, {runValidators: true, new: true});

        res.status(200).send(newProblem);

    }
    catch(err){
        res.status(400).send("Error: "+err);
    }
}


const deleteProblem = async(req, res) =>{
    const {id} = req.params
    try{
        if(!id) {
            return res.status(400).send("Id is required");
        }
        
        const deletedProblem = await Problem.findByIdAndDelete(id);

        if(!deletedProblem) {
            return res.status(400).send("Problem is missing");
        }

        res.status(200).send("Problem Deleted Successfully");

    }
    catch(err){
        res.status(500).send("Error: "+err);
    }
}


const getProblemById = async(req, res) =>{
    const {id} = req.params
    try{
        if(!id) {
            return res.status(400).send("Id is required");
        }
        
        const getProblem = await Problem.findById(id).select('_id title description tags visibleTestCases startCode referenceSolution');

        if(!getProblem) {
            return res.status(404).send("Problem is missing");
        }

        res.status(200).send(getProblem);

    }
    catch(err){
        res.status(500).send("Error: "+err);
    }
}


const getAllProblem = async(req, res) =>{
    try{
        const getProblem  = await Problem.find({}).select('_id title difficulty tags');

        if(getProblem.length == 0) {
            return res.status(404).send("Problem is missing");
        }

        res.status(200).send(getProblem);
    }
    catch(err){
        res.status(500).send("Error: "+err);
    }
}


module.exports = {createProblem, updateProblem, deleteProblem, getProblemById, getAllProblem};