const Problem = require('../models/problem');
const Submission = require('../models/submission');
const {getLanguageById, submitBatch, submitToken} = require('../utils/problemUtility');
const submitCode = async(req, res) =>{
    // 
    try{
        const userId = req.result._id;
        const problemId = req.params.id;


        const{code, language} = req.body;

        if(!userId || !code || !problemId || !Language)
            return res.status(400).send("Some field is missing");

        // Fetch the problem from database
        const problem = await Problem.findById(problemId);

        // hidden testcases milenge


        // Kya apna submission store kar du pehle bina Judge0 ko bheje? nahi
        const submittedResult = await Submission.create({
            userId,
            problemId,
            code,
            language,
            testCasesPassed: 0,
            status: "pending",
            testCasesTotal: problem.hiddenTestCases.length
        })


        // Send the submission to Judge0
        const languageId = getLanguageById(language);
        const submission = problem.hiddenTestCases.map((testCases) =>({
            source_code: code,
            language_id: languageId,
            stdin: testCases.input,
            expected_output: testCases.output
        }));


        const submitResult = await submitBatch(submission);

        const resultToken = submitResult.map((value)=> value.token);
        const testResult = await submitToken(resultToken);

        // submitted Result ko update karo
        



    }
    catch(err){
        
    }
}


module.exports = submitCode;