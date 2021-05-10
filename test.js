const Joi = require('joi');

const user = {
    fullname: "jayant malik",
    email: "demo@mail.com",
    password: "password111",
    username: "hello",
    name: "Hello"
};

// You define your schema here
const user_schema = Joi
  .object({
    fullname: Joi.string().min(4).max(30).trim(),
    email: Joi.string().email().required().min(10).max(50).trim(),
    password: Joi.string().min(6).max(20),
    username: Joi.string().min(5).max(20).alphanum().trim()
  })

// You validate the object here.
const result = user_schema.validate(user, { stripUnknown: true });

// Here is your final result with unknown keys trimmed from object.
console.log("Object with trimmed keys: ", result.value);