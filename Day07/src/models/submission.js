const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const submissionSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    problemId: {
        type: Schema.Types.ObjectId,
        ref: 'Problem',
        required: true
    },
    code: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true,
        enum: ['javascript','cpp', 'java']
    },
    status: {   
        type: String,
        enum: ['pending', 'accepted', 'wrong_answer', 'time_limit_exceeded', 'compilation_error', 'runtime_error'],
        default: 'pending'
    },
    runtime: {
        type: Number,  //milliseconds
        default: 0
    },
    memory: {
        type: Number,  //bytes
        default: 0
    },
    errorMessage: {
        type: String,
        default: ''
    },
    testCasesPassedf:{
        type: Number,
        default: 0
    },
    testCasesTotal: {
        type: Number,
        default: 0
    },
 }, {
        timestamps: true
});


const Submission = mongoose.model('submission', submissionSchema);
module.exports = Submission;