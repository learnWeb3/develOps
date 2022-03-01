import mongoose from "mongoose";
import { BadRequestError } from "../base/errors/index.js";
import Category from "./category.model.js";
import User from "./user.model.js";
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
    },
    content: {
      type: Mixed,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { getters: true },
  }
);

articleSchema.static.register = async (
  data = {
    user: null,
    category: null,
    title: null,
    content: null,
  }
) => {
  const { user, category, title, content } = data;

  if (!user || !category || !title || !content) {
    throw new BadRequestError(
      "Missing required parameters among user, category, title, content"
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
    content: JSON.parse(content),
  });

  const savedArticle = await newArticle.save();

  return savedArticle;
};

articleSchema.virtual("quiz", {
  localField: "_id",
  foreignField: "article",
  count: true,
});

export default model("Article", articleSchema);
