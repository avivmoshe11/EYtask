const express = require("express");
const router = express.Router();
const joi = require("joi");
const { User } = require("../models/users");
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
  //validate user input

  const { error } = validateAuth(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  //validate system
  let user = await User.findOne({ email: req.body.email.toLowerCase() });
  if (!user) {
    return res.status(400).send("invalid email");
  }

  const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
  if (!isPasswordValid) {
    return res.status(400).send("invalid password");
  }
  //process

  //create JWT
  const token = user.generateAuthToken();
  //response
  res.send({ token });
});

function validateAuth(user) {
  const schema = joi.object({
    email: joi.string().min(6).max(255).required().email(),
    password: joi.string().min(6).max(1024).required(),
  });
  return schema.validate(user);
}

module.exports = router;
