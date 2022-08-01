const mongoose = require("mongoose");
const joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
  },
  email: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 1024,
  },
  admin: {
    type: Boolean,
    required: true,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  friends: [
    {
      type: String,
    },
  ],
});

userSchema.methods.generateAuthToken = function generateAuthToken() {
  return jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
      admin: this.admin,
    },
    config.get("jwtkey")
  );
};

const User = mongoose.model("User", userSchema, "users");

function validateUser(user) {
  const schema = joi.object({
    name: joi.string().min(2).max(255).required(),
    email: joi.string().min(6).max(255).required().email(),
    password: joi.string().min(6).max(1024).required(),
    admin: joi.boolean(),
  });
  return schema.validate(user);
}

function validateUserUpdate(user) {
  const schema = joi.object({
    name: joi.string().min(2).max(255).required(),
    email: joi.string().min(6).max(255).required().email(),
  });
  return schema.validate(user);
}

module.exports = {
  User,
  validateUser,
  validateUserUpdate,
};
