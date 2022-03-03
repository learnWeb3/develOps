import mongoose from "mongoose";
import { BadRequestError, InternalServerError, UnauthorizedError } from "../base/errors/index.js";
import Question from "./question.model.js";
import Answer from "./answer.model.js";
import Article from "./article.model.js";
import User from "./user.model.js";
import UserAnswer from "./user_answer.model.js";

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
    toObject: { getters: true, virtuals: true },
  }
);

// HOOKS (DB MIDDLEWARE)

// AUTOREMOVE
quizSchema.pre("deleteOne", {document: true, query: false},  async function (next) {
  console.log('running')
  await Question.find({
    quiz: this._id,
  }).then(async (questions)=>{
    for(const question of questions){
      await question.deleteOne()
    }
  });
  next();
});

// AUTOPOPULATE
quizSchema.pre("find", function (next) {
  this.populate("questions");
  next();
});

quizSchema.pre("findOne", function (next) {
  this.populate("questions");
  next();
});

quizSchema.pre("find", function (next) {
  this.populate("questionsCount");
  next();
});

quizSchema.pre("findOne", function (next) {
  this.populate("questionsCount");
  next();
});

// VIRTUAL ATTRIBUTES
quizSchema.virtual("questions", {
  ref: "Question",
  localField: "_id",
  foreignField: "quiz",
});

quizSchema.virtual("questionsCount", {
  ref: "Question",
  localField: "_id",
  foreignField: "quiz",
  count: true,
});

// CLASS METHODS
quizSchema.statics.registerAnswer = async function (
  id = null,
  data = {
    question: null,
    current_user: null,
  }
) {
  if (!id) {
    throw new BadRequestError(`Missing required parameters among: id`);
  }

  const quizzModel = await this.findOne({
    _id: id,
  });

  if (!quizzModel) {
    throw new BadRequestError(`Quiz with id: ${id} does not exists`);
  }

  const { current_user, question } = data;
  if (!current_user || !question) {
    throw new BadRequestError(
      `Missing required parameters among: question, current_user`
    );
  }

  const currentUserModel = await User.findOne({
    _id: current_user,
  });

  if (!currentUserModel) {
    throw new UnauthorizedError(`You must be logged in to perform this action`);
  }

  const quizQuestions = await this.findOne({
    _id: id,
  }).then((quiz) => quiz.questions);


  const userAnswers = [];

  try {
    for (let i = 0; i < quizQuestions.length; i++) {
      const availableAnswers = quizQuestions[i].answers;
      const validAnswer = availableAnswers.find((answer) => answer.isValid);
      const userAnswerIsValid = validAnswer._id === question[i];
      const data = {
        user: current_user,
        question: quizQuestions[i]._id,
        answer: question[i],
        isValid: userAnswerIsValid,
      }
      const userAnswer = await UserAnswer.register(data);
      userAnswers.push(userAnswer);
      return ({
        quiz: id,
        userAnswers,
      })
    }
  } catch (error) {
    // delete registered answers
    if(userAnswers.length){
      try {
        for(const userAnswer of userAnswers){
          await UserAnswer.deleteOne({
            _id: userAnswer._id
          })
        }
      } catch (error) {
        throw new InternalServerError('An unexpected error occured, we are investigating the issue, please try again later.')
      }
    }
    throw new InternalServerError('An unexpected error occured, we are investigating the issue, please try again later.')
  }
};

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

  // required parameters check
  if (!title || !questionContent || !answer || !isValid || !article) {
    throw new BadRequestError(
      "Missing parameter(s) among:  title, questionContent, answer, isValid, article"
    );
  }

  // form manipulation check (dependent on specific format)
  if (
    questionContent.length !== answer.length ||
    questionContent.length !== isValid.length ||
    isValid.length !== questionContent.length
  ) {
    throw new BadRequestError("Invalid informations sent...");
  }

  // check if article exists
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
  try {
    for (const question of questionContent) {
      const savedQuestion = await Question.register({
        quiz: savedQuiz.id,
        content: question,
      });
      quizQuestions.push(savedQuestion);
    }
  } catch (error) {
    // removing quiz and questions on pre hook if error
    await this.deleteOne({
      _id: savedQuiz.id,
    });
  }

  try {
    // save the answers
    for (let i = 0; i < quizQuestions.length; i++) {
      const quizQuestion = quizQuestions[i];
      // format related answers to the quizzQuestions
      const quizQuestionAnswers = answer[i].map((ans, index) => ({
        answer: ans,
        isValid: isValid[i][index],
      }));
      const savedQuizQuestionAnswers = [];
      // save to answers to db
      for (const { isValid, answer } of quizQuestionAnswers) {
        const savedAnswer = await Answer.register({
          content: answer,
          question: quizQuestion.id,
          isValid,
        });
        savedQuizQuestionAnswers.push(savedAnswer);
      }
      quizQuestion.answers = savedQuizQuestionAnswers;
    }
  } catch (error) {
    // removing quiz and questions on pre hook if error
    await this.deleteOne({
      _id: savedQuiz.id,
    });
  }

  return {
    quiz: newQuiz,
    questions: quizQuestions
  };
};

export default model("Quiz", quizSchema);
