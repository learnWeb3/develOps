import mongoose from "mongoose";
import { BadRequestError } from "../base/errors/index.js";
import Quiz from "./quiz.model.js";
const { Schema, model } = mongoose;
const {
  Types: { ObjectId },
} = Schema;

const questionSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    quiz: {
      type: ObjectId,
      required: true,
      ref: "Quiz",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { getters: true },
  }
);

questionSchema.virtual("answers", {
  localField: "_id",
  foreignField: "question",
  count: true,
});

questionSchema.statics.register = async function(
  data = {
    quiz: null,
    content: null,
  }
){
  const { quiz, content } = data;
  if (!quiz || !content) {
    throw new BadRequestError(
      `Missing required parameter(s) among quiz, content`
    );
  }
  const quizModel = await Quiz.findOne({
    _id: id,
  });

  if (!quizModel) {
    throw new BadRequestError(`Quiz with id ${quiz} does not exists`);
  }

  const newQuiz = new this({
    quiz,
    content,
  });

  const validate = newQuiz.validateSync();
  if (validate !== undefined) {
    throw new BadRequestError(`Validation error: ${validate.message}`);
  }

  return await newQuiz.save();
};

export default model("Question", questionSchema);
