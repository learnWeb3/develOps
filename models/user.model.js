import mongoose from "mongoose";
import validator from "validator";
import {
  BadRequestError,
  ForbiddenError,
  UnauthorizedError,
} from "../base/errors/index.js";
import bcrypt from "bcrypt";
import Article from "./article.model.js";
import UserAnswer from "./user_answer.model.js";

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
    toObject: { getters: true, virtuals: true },
  }
);

// HOOKS (DB MIDDLEWARES);

// AUTOPOPULATE (TRANSACTION SPEED COST)
userSchema.pre("find", function (next) {
  this.populate("articles");
  next();
});

userSchema.pre("findOne", function (next) {
  this.populate("articles");
  next();
});

userSchema.pre("find", function (next) {
  this.populate("articlesCount");
  next();
});

userSchema.pre("findOne", function (next) {
  this.populate("articlesCount");
  next();
});

userSchema.pre("find", function (next) {
  this.populate("answers");
  next();
});

userSchema.pre("findOne", function (next) {
  this.populate("answersCount");
  next();
});

// AUTOREMOVE RELATED RECORDS (DATA INTEGRITY)
userSchema.pre("deleteOne", {document: true, query: false},  async function (next) {
  console.log('running')
  await Article.find({
    user: this._id,
  }).then(async (articles)=>{
    for(const article of articles){
      await article.deleteOne()
    }
  });
  await UserAnswer.find({
    user: this._id,
  }).then(async (userAnswers)=>{
    for(const userAnswer of userAnswers){
      await userAnswer.deleteOne()
    }
  })
  next()
});


// VIRTUAL ATTRIBUTES (REALTIONS*)
userSchema.virtual("articles", {
  ref: "Article",
  localField: "_id",
  foreignField: "user",
});

userSchema.virtual("articlesCount", {
  ref: "Article",
  localField: "_id",
  foreignField: "user",
  count: true,
});

userSchema.virtual("answers", {
  ref: "UserAnswer",
  localField: "_id",
  foreignField: "user",
});

userSchema.virtual("answersCount", {
  ref: "UserAnswer",
  localField: "_id",
  foreignField: "user",
  count: true,
});

// INSTANCE METHODS
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

// CLASS METHODS
userSchema.statics.saveChange = async function (
  id = null,
  data = {
    email: null,
    password: null,
    password_confirmation: null,
    username: null,
    current_password: null,
    current_user: null,
  }
) {
  const {
    username,
    password,
    email,
    password_confirmation,
    current_password,
    current_user,
  } = data;

  if (!id) {
    throw new BadRequestError(`Missing user id`);
  }

  if (!username || !password || !email || !password_confirmation) {
    throw new BadRequestError(
      "Missing required parameter among username, password, password_confirmation, email"
    );
  }

  if (password !== password_confirmation) {
    throw new BadRequestError("Password does not match password confirmation");
  }

  const targetedUser = await this.findOne({
    _id: id,
  });
  const currentUser = await this.findOne({
    _id: current_user,
  });
  const accountUsingUsername = await this.findOne({
    username,
  });

  const accountUsingEmail = await this.findOne({
    email,
  });

  if (!currentUser) {
    throw new UnauthorizedError(
      `You must be logged in order to perform this operation`
    );
  }

  if (!targetedUser) {
    throw new BadRequestError(`User with id ${id} does not exist`);
  }

  if (accountUsingUsername) {
    throw new BadRequestError(
      "username has already been taken, please choose an other one"
    );
  }

  if (accountUsingEmail) {
    throw new BadRequestError("email is already registered");
  }

  if (
    targetedUser._id !== currentUser._id &&
    currentUser.role !== roles.admin
  ) {
    throw new UnauthorizedError(
      "You do not have the rights to perform this action"
    );
  }

  if (currentUser.role !== roles.admin) {
    await targetedUser.passwordVerify(current_password);
  }

  Object.assign(targetedUser, {
    email,
    password,
    username,
  });

  await targetedUser.hashPassword();

  const validate = targetedUser.validateSync();
  if (validate !== undefined) {
    throw new BadRequestError(`Validation error: ${validate.message}`);
  }

  const updatedUser = await targetedUser.save();

  return updatedUser;
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
