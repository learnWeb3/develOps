import mongoose from "mongoose";
import { BadRequestError } from "../base/errors/index.js";
import Question from "./question.model.js";
import UserAnswer from "./user_answer.model.js";
const { Schema, model } = mongoose;
const {
  Types: { ObjectId },
} = Schema;

const answerSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 100,
    },
    question: {
      type: ObjectId,
      required: true,
      ref: "Question",
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

// DB HOOKS

// AUTOREMOVE (DATA INTEGRITY)
answerSchema.pre(
  "deleteOne", {document: true, query: false},
  async function (next) {
    const userAnswers = await UserAnswer.find({
      answer: this._id,
    });
    //console.log(userAnswers)
    for(const userAnswer of userAnswers){
      return await userAnswer.deleteOne()
    }
    next()
  }
);

// CLASS METHODS
answerSchema.statics.register = async function (
  data = {
    content: null,
    question: null,
    isValid: false,
  }
) {
  const { question, content, isValid } = data;
  if (!question || !content || isValid === null || isValid === undefined) {
    throw new BadRequestError(
      `Missing required parameter(s) among question, content, isValid`
    );
  }

  const questionModel = await Question.findOne({
    _id: question,
  });

  if (!questionModel) {
    throw new BadRequestError(`Question with id ${question} does not exists.`);
  }
  const newAnswer = new this({
    ...data,
  });

  const validate = newAnswer.validateSync();
  if (validate !== undefined) {
    throw new BadRequestError(`Validation error: ${validate.message}`);
  }

  return await newAnswer.save();
};

export default model("Answer", answerSchema);
