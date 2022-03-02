import mongoose from "mongoose";
import { BadRequestError } from "../base/errors/index.js";
import Question from "./question.model.js";
import Answer from "./answer.model.js";
import Article from "./article.model.js";

const { Schema, model } = mongoose;
const {
  Types: { ObjectId },
} = Schema;

const quizSchema = new Schema(
  {
    title: {
      type: String,
      minlength: 1,
      maxlength: 100,
      unique: true,
    },
    article: {
      type: ObjectId,
      ref: "Article",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { getters: true },
  }
);

quizSchema.virtual("questions", {
  localField: "_id",
  foreignField: "quiz",
  count: true,
});

quizSchema.statics.register = async function (
  data = {
    article: null,
    title: null,
    questionContent: null,
    answer: null,
    isValid: null,
  }
) {
  // {
  //   title: 'test',
  //   questionContent: [ 'Q1', 'Q2' ],
  //   answer: [ [ 'A1', 'A2', 'A3' ], [ 'A1', 'A2', 'A3' ] ],
  //   isValid: [ [ '1', '0', '0' ], [ '1', '0', '0' ] ]
  // }
  const { article, title, questionContent, answer, isValid } = data;

  if (!title || !questionContent || !answer || !isValid || !article) {
    throw new BadRequestError(
      "Missing parameter(s) among:  title, questionContent, answer, isValid, article"
    );
  }

  if (
    questionContent.length !== answer.length ||
    questionContent.length !== isValid.length ||
    isValid.length !== questionContent.length
  ) {
    throw new BadRequestError("Invalid informations sent...");
  }

  const articleModel = await Article.findOne({
    _id: article,
  });

  if (!article) {
    throw new BadRequestError(`Article with id: ${id} does not exists`);
  }

  const newQuiz = new this({
    article,
    title,
  });

  const validate = newQuiz.validateSync();
  if (validate !== undefined) {
    throw new BadRequestError(`Validation error(s): ${validate.message}`);
  }

  // save the quiz
  const savedQuiz = await newQuiz.save();

  // save the questions
  const quizQuestions = [];
  for (const question of questionContent) {
    const savedQuestion = await Question.register({
      quiz: savedQuiz.id,
      content: question,
    });
    quizQuestions.push(savedQuestion);
  }

  // save the answers
  for (let i = 0; i < quizQuestions.length; i++) {
    const quizQuestion = quizQuestions[i];
    // format related answers to the quizzQuestions
    const quizQuestionAnswers = answer[i].map((ans, index) => ({
      answer: ans,
      isValid: isValid[i][index],
    }));
    // save to answers to db
    for (const { isValid, answer } of quizQuestionAnswers) {
      const savedAnswer = await Answer.register({
        content: answer,
        question: quizQuestion.id,
        isValid,
      });
    }
  }
};

export default model("Quiz", quizSchema);
