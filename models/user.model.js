import mongoose from "mongoose";
import validator from "validator";
import { BadRequestError, ForbiddenError } from "../base/errors/index.js";
import bcrypt from "bcrypt";

const { Schema, model } = mongoose;
const {
  Types: { ObjectId },
} = Schema;

export const roles = {
  admin: 1,
  user: 0,
};
const userSchema = new Schema(
  {
    username: {
      type: String,
      maxlength: 50,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      maxlength: 50,
      required: true,
      unique: true,
      validate: {
        validator: function (value) {
          return validator.isEmail(value);
        },
        message: "Must be a valid email",
      },
    },
    password: {
      type: String,
      maxlength: 256,
      required: true,
      validate: {
        validator: function (value) {
          const matchCapitalLetter = value.match(/[A-Z]*/);
          const matchLowerCaseLetter = value.match(/[a-z]*/);
          const matchNumber = value.match(/\d*/);
          const matchSpecialChar = value.match(/[^A-Za-z0-9]/);
          return (
            matchCapitalLetter &&
            matchLowerCaseLetter &&
            matchNumber &&
            matchSpecialChar
          );
        },
        message:
          "Must be a valid password, must contains capitalcase letter, lowercase letter, number and special character",
      },
    },
    role: {
      type: Number,
      max: 1,
      min: 0,
      required: true,
      default: roles.user,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { getters: true },
  }
);

userSchema.virtual("articles", {
  localField: "_id",
  foreignField: "user",
  count: true,
});

userSchema.methods.hashPassword = async function () {
  const saltRounds = 10;
  const hash = await new Promise((resolve, reject) =>
    bcrypt.hash(this.password, saltRounds, function (err, hash) {
      if (err) {
        reject();
      } else {
        resolve(hash);
      }
    })
  );
  this.password = hash;
  return this;
};

userSchema.statics.register = async function (
  data = {
    username: null,
    password: null,
    email: null,
    password_confirmation: null,
  }
) {
  const { username, password, email, password_confirmation } = data;

  const accountUsingUsername = await this.findOne({
    username,
  });

  const accountUsingEmail = await this.findOne({
    email,
  });

  if (!username || !password || !email || !password_confirmation) {
    throw new BadRequestError(
      "Missing required parameter among username, password, password_confirmation, email"
    );
  }

  if (accountUsingUsername) {
    throw new BadRequestError(
      "username has already been taken, please choose an other one"
    );
  }

  if (accountUsingEmail) {
    throw new BadRequestError("email is already registered");
  }

  const newUser = new this({
    username,
    password,
    email,
    password_confirmation,
  });

  const validate = newUser.validateSync();
  if (validate !== undefined) {
    throw new BadRequestError(validate.message);
  }

  await newUser.hashPassword();
  const savedUser = await newUser.save();
  return savedUser;
};

userSchema.methods.passwordVerify = async function (textPassword) {
  const check = await new Promise((resolve, reject) =>
    bcrypt.compare(textPassword, this.password, function (err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    })
  );

  if (!check) {
    throw new ForbiddenError("invalid credentials");
  }
};

userSchema.statics.login = async function (data = { email, password }) {
  const { email, password } = data;
  if (!email || !password) {
    throw new BadRequestError(
      "Missing required parameter among email, password"
    );
  }
  const potentialUser = await this.findOne({
    email,
  });
  if (!potentialUser) {
    throw new ForbiddenError("invalid credentials");
  }
  await potentialUser.passwordVerify(password);
  return potentialUser;
};

export default model("User", userSchema);
