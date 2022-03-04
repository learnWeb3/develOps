import mongoose from "mongoose";
import { BadRequestError, NotFoundError } from "../base/errors/index.js";
import Category from "./category.model.js";
import User from "./user.model.js";
import UserAnswer from "./user_answer.model.js";
import { sliceStringAsPreview } from "../base/utils.js";
import moment from "moment";
import Quiz from "./quiz.model.js";

const { Schema, model } = mongoose;
const {
  Types: { ObjectId, Mixed },
} = Schema;

const articleSchema = new Schema(
  {
    user: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: ObjectId,
      ref: "Category",
      required: true,
    },
    title: {
      type: String,
      minlength: 1,
      maxlength: 100,
      unique: true,
    },
    preview: {
      type: String,
      minlength: 1,
      maxlength: 100,
    },
    imgPreview: {
      type: String,
    },
    content: {
      type: Mixed,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { getters: true, virtuals: true },
  }
);

// DB HOOKS (DB TX MIDDLEWARE)

// AUTOREMOVE (CASCADE LIKE)

articleSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    console.log("running");
    const quizs = await Quiz.find({
      article: this._id,
    });
    //console.log(quizs)
    for (const quiz of quizs) {
      return await quiz.deleteOne();
    }
    next();
  }
);

// AUTOPOPULATE
articleSchema.pre("findOne", function (next) {
  this.populate({
    path: "quiz",
  });
  next();
});

articleSchema.pre("findOne", function (next) {
  this.populate({
    path: "quizCount",
  });
  next();
});

articleSchema.virtual("quiz", {
  ref: "Quiz",
  localField: "_id",
  foreignField: "article",
});

articleSchema.virtual("quizCount", {
  ref: "Quiz",
  localField: "_id",
  foreignField: "article",
  count: true,
});

// CLASS METHODS

articleSchema.statics.findOneWithUserResponse = async function (article, user) {
  const userModel = await User.findOne({
    _id: user,
  });
  if (!userModel) {
    throw new NotFoundError(`User with id ${user} does not exists`);
  }
  const articleModel = await this.findOne({
    _id: article,
  });
  if (!articleModel) {
    throw new NotFoundError(
      "Article does not exists or has been moved to an other location"
    );
  }

  const data = {
    id: articleModel.id,
    user: articleModel.user,
    category: articleModel.category,
    title: articleModel.title,
    preview: articleModel.preview,
    imgPreview: articleModel.imgPreview,
    content: articleModel.content,
    quiz: [],
  };

  const quiz = articleModel.quiz;
  const quizData = [];
  for (const quizElement of quiz) {
    const userAnswers = [];
    const questions = quizElement.questions;
    const questionData = [];
    for (const question of questions) {
      questionData.push({
        id: question.id,
        content: question.content,
        quiz: question.quiz,
        answers: question.answers,
      });
      userAnswers.push(
        ...(await UserAnswer.find({
          user,
          question: question.id,
        })
          .populate("question")
          .populate("answer"))
      );
      console.log(userAnswers);
    }
    quizData.push({
      id: quizElement.id,
      title: quizElement.title,
      article: quizElement.article,
      userHasAnswered: userAnswers.length ? true : false,
      questions: questionData,
      userAnswers,
    });
  }

  data.quiz = quizData;

  return data;
};
articleSchema.statics.findOneWithQuizz = async function (id) {
  const article = await this.findOne({
    _id: id,
  });
  if (!article) {
    throw new NotFoundError(
      "Article does not exists or has been moved to an other location"
    );
  }

  return article;
};

articleSchema.statics.saveChange = async function (id, update = {}) {
  const { user, category, title, content, preview, imgPreview } = update;
  if (!user || !category || !title || !content || !id || !preview) {
    throw new BadRequestError(
      "Missing required parameters among user, category, title, content, preview, id"
    );
  }

  const article = await this.findOne({
    _id: id,
  });

  if (!article) {
    throw new BadRequestError(
      `Article with id ${id} does not exists anymore !`
    );
  }

  const author = await User.findOne({
    _id: user,
  });

  if (!author) {
    throw new BadRequestError("User does not exists");
  }

  const articleCategory = await Category.findOne({
    _id: category,
  });

  if (!category) {
    throw new BadRequestError("Category does not exists");
  }

  Object.assign(article, {
    user: author._id,
    category: articleCategory._id,
    title,
    content: content.replace(/<script/, "<SCRIPT_OPEN_TAG").replace(/<\/script>/, "<\\/SCRIPT_CLOSE_TAG>"),
    preview: sliceStringAsPreview(preview, 50),
    imgPreview,
  });

  const validate = article.validateSync();
  if (validate !== undefined) {
    throw new BadRequestError(`Validation error: ${validate.message}`);
  }

  const updatedArticle = await article.save();

  return updatedArticle;
};

articleSchema.statics.findLast = async function (number) {
  return await this.find({}, null, { sort: { createdAt: -1 } })
    .limit(number)
    .then((articles) => articles.map((article) => article.formatOneData()));
};

articleSchema.statics.getCount = async function () {
  return await this.countDocuments();
};

articleSchema.statics.search = async function (
  search = null,
  category = null,
  limit = 10,
  offset = 0
) {
  let count = 0;
  let articles = [];
  if (search) {
    const query = new RegExp(search, "i");
    count =  await this.countDocuments({
      $or: [{ title: query }, { content: query }, { preview: query }],
    });
    articles = await this.find({
      $or: [{ title: query }, { content: query }, { preview: query }],
    })
      .skip(offset)
      .limit(limit);
  } else if (category) {
    count = await this.countDocuments({
      category,
    })
    articles = await this.find({
      category,
    })
      .skip(offset)
      .limit(limit);
  } else {
    count = await this.countDocuments({})
    articles = await this.find({}, null, { sort: { createdAt: -1 } })
      .skip(offset)
      .limit(limit);
  }

  return {
    pageNumber: Math.ceil(count / limit),
    articles: articles.map((article) => article.formatOneData()),
  };
};

articleSchema.statics.register = async function (
  data = {
    user: null,
    category: null,
    title: null,
    content: null,
    preview: null,
    imgPreview: null,
  }
) {
  const { user, category, title, content, preview, imgPreview } = data;

  if (!user || !category || !title || (!content && !preview)) {
    throw new BadRequestError(
      "Missing required parameters among user, category, title, content, preview"
    );
  }

  const author = await User.findOne({
    _id: user,
  });

  if (!author) {
    throw new BadRequestError("User does not exists");
  }

  const articleCategory = await Category.findOne({
    _id: category,
  });

  if (!category) {
    throw new BadRequestError("Category does not exists");
  }

  const newArticle = new this({
    user: author._id,
    category: articleCategory._id,
    title,
    content: content.replace(/<script/, "<SCRIPT_OPEN_TAG").replace(/<\/script>/, "<\\/SCRIPT_CLOSE_TAG>"),
    preview: sliceStringAsPreview(preview, 50),
    imgPreview,
  });

  const validate = newArticle.validateSync();
  if (validate !== undefined) {
    throw new BadRequestError(`Validation error: ${validate.message}`);
  }

  const savedArticle = await newArticle.save();

  return savedArticle;
};

articleSchema.methods.formatOneData = function () {
  return {
    id: this._id,
    title: this.title,
    preview: this.preview,
    imgPreview: this.imgPreview,
    content: this.content,
    createdAt: moment(this.createdAt).format("MMM Do YY"),
    updatedAt: moment(this.createdAt).format("MMM Do YY"),
  };
};

export default model("Article", articleSchema);
