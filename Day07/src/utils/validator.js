const validator = require("validator");

const validate = (data) => {
  const required = ['firstName', 'emailId', 'password'];
  if (!required.every(field => field in data)) {
    throw new Error("Missing required fields");
  }

  if (!validator.isEmail(data.emailId)) {
    throw new Error("Invalid Email");
  }

  if (!validator.isStrongPassword(data.password)) {
    throw new Error("Password must be strong (uppercase, lowercase, number, symbol, 8+ chars)");
  }
};

module.exports = validate;
