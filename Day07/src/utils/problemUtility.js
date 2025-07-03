const axios = require('axios');


const getLanguageById = (lang)=>{
    const language = {
        // "C": 50,
        "cpp": 54,
        "java": 62,
        // "Python": 71,
        "javascript": 63,
    }

    return language[lang.toLowerCase()];
}


// Judge0 ko bhejunga
const submitBatch = async (submissions) =>{
    const axios = require('axios');

const options = {
  method: 'POST',
  url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
  params: {
    base64_encoded: 'false'
  },
  headers: {
    'x-rapidapi-key': '46fa31651fmsh0038e433f75ad5cp1f8502jsnb09f1daad5e5',
    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
    'Content-Type': 'application/json'
  },
  data: {
    submissions
  }
};

async function fetchData() {
	try {
		const response = await axios.request(options);
		return response.data;
	} catch (error) {
		console.error(error);
	}
}

return await fetchData();

}


const waiting = (timer) => new Promise(resolve => setTimeout(resolve, timer));


const submitToken = async (resultToken) =>{

const options = {
  method: 'GET',
  url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
  params: {
    tokens: resultToken.join(","),
    base64_encoded: 'false',
    fields: '*'
  },
  headers: {
    'x-rapidapi-key': '46fa31651fmsh0038e433f75ad5cp1f8502jsnb09f1daad5e5',
    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
  }
};

async function fetchData() {
	try {
		const response = await axios.request(options);
		return response.data;
	} catch (error) {
		console.error(error);
	}
}

while(true) {
const result = await fetchData();

const IsResultObtained = result.submissions.every((r) => r.status_id>2);

if(IsResultObtained)
  return result.submissions;

await waiting(1000);

}

// fetchData();
}

module.exports = { getLanguageById, submitBatch, submitToken};





// 
// const axios = require('axios');

// const options = {
//   method: 'POST',
//   url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
//   params: {
//     base64_encoded: 'true'
//   },
//   headers: {
//     'x-rapidapi-key': '46fa31651fmsh0038e433f75ad5cp1f8502jsnb09f1daad5e5',
//     'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
//     'Content-Type': 'application/json'
//   },
//   data: {
//     submissions: [
//       {
//         language_id: 46,
//         source_code: 'ZWNobyBoZWxsbyBmcm9tIEJhc2gK'
//       },
//       {
//         language_id: 71,
//         source_code: 'cHJpbnQoImhlbGxvIGZyb20gUHl0aG9uIikK'
//       },
//       {
//         language_id: 72,
//         source_code: 'cHV0cygiaGVsbG8gZnJvbSBSdWJ5IikK'
//       }
//     ]
//   }
// };

// async function fetchData() {
// 	try {
// 		const response = await axios.request(options);
// 		console.log(response.data);
// 	} catch (error) {
// 		console.error(error);
// 	}
// }

// fetchData();