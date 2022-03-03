import mongoose from "mongoose";
import { BadRequestError } from "../base/errors/index.js";
import Quiz from "./quiz.model.js";
import Answer from "./answer.model.js";
import UserAnswer from "./user_answer.model.js";
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
    toObject: { getters:true,virtuals: true }
  }
);

// DB HOOKS (DB TX MIDDLEWARE)

// AUTOREMOVE (CASCADE DELETION LIKE)

questionSchema.pre('deleteOne', {document: true, query: false}, async function(next){
  console.log('running')
  const answers = await Answer.find({
    question: this._id
  })
  for(const answer of answers){
    //console.log(answer)
    await answer.deleteOne()
  }
  const userAnswers = await UserAnswer.find({
    question: this._id
  })
  for(const userAnswer of userAnswers){
    //console.log(userAnswer)
    await userAnswer.deleteOne()
  }
  next()
})

// AUTOPOPULATE
questionSchema.pre('find', function(next){
  this.populate('answers')
  next()
})

questionSchema.pre('find', function(next){
  this.populate('answersCount')
  next()
})

questionSchema.pre('findOne', function(next){
  this.populate('answers')
  next()
})

questionSchema.pre('findOne', function(next){
  this.populate('answersCount')
  next()
})

// VIRTUAL ATTRIBUTES
questionSchema.virtual("answers", {
  ref: 'Answer',
  localField: "_id",
  foreignField: "question",
});

questionSchema.virtual("answersCount", {
  ref: 'Answer',
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
    _id: quiz,
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
