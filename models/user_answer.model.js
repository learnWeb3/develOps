import mongoose from "mongoose";
import { BadRequestError } from "../base/errors/index.js";
import Answer from "./answer.model.js";
import Question from "./question.model.js";
import User from "./user.model.js";
import Quiz from "./quiz.model.js";

const { Schema, model } = mongoose;
const {
  Types: { ObjectId },
} = Schema;

const userAnswerSchema = new Schema(
  {
    user: {
      type: ObjectId,
      required: true,
      ref: "User",
    },
    quiz: {
      type: ObjectId,
      required: true,
      ref: "Quiz",
    },
    question: {
      type: ObjectId,
      required: true,
      ref: "Question",
    },
    answer: {
      type: ObjectId,
      required: true,
      ref: "Answer",
    },
    isValid: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { getters: true, virtuals: true },
  }
);

// CLASS METHODS
userAnswerSchema.statics.register = async function (
  data = {
    user: null,
    question: null,
    answer: null,
    isValid: false,
    quiz: null,
  }
) {
  const { question, answer, isValid, user, quiz } = data;
  if (
    !question ||
    !answer ||
    !user ||
    !quiz ||
    isValid === null ||
    isValid === undefined
  ) {
    throw new BadRequestError(
      `Missing required parameter(s) among quiz, user, question, answer, isValid`
    );
  }

  // user
  const userModel = await User.findOne({
    _id: user,
  });

  if (!userModel) {
    throw new BadRequestError(`User with id ${user} does not exists.`);
  }

  // quiz

  const quizModel = await Quiz.findOne({
    _id: quiz,
  });
  if (!quizModel) {
    throw new BadRequestError(`Quiz with id ${quiz} does not exists.`);
  }

  // question
  const questionModel = await Question.findOne({
    _id: question,
  });
  if (!questionModel) {
    throw new BadRequestError(`Question with id ${question} does not exists.`);
  }

  // answer
  const answerModel = await Answer.findOne({
    _id: answer,
  });
  if (!answerModel) {
    throw new BadRequestError(`Answer with id ${answer} does not exists.`);
  }

  // create
  const newUserAnswer = new this({
    quiz,
    answer,
    question,
    isValid,
    user,
  });

  // validate
  const validate = newUserAnswer.validateSync();
  if (validate !== undefined) {
    throw new BadRequestError(`Validation error: ${validate.message}`);
  }

  // save
  return await newUserAnswer.save();
};

export default model("UserAnswer", userAnswerSchema);
