import mongoose from "mongoose";
import { BadRequestError } from "../base/errors/index.js";
import Article from "./article.model.js";
const { Schema, model } = mongoose;
const {
  Types: { ObjectId },
} = Schema;
const categorySchema = new Schema(
  {
    label: {
      type: String,
      maxlength: 100,
      minlength: 1,
      unique: true,
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
categorySchema.pre("remove", function (next) {
  Article.remove({
    category: this._id,
  });
  next();
});

// VIRTUAL ATTRIBUTES
categorySchema.virtual("articles", {
  ref: "Article",
  localField: "_id",
  foreignField: "article",
});

categorySchema.virtual("articlesCount", {
  ref: "Article",
  localField: "_id",
  foreignField: "article",
  count: true,
});

// CLASS METHODS
categorySchema.statics.register = async function (
  data = {
    label: null,
  }
) {
  const { label } = data;
  if (!label) {
    throw new BadRequestError("Missing required parameters among: label");
  }
  const newCategory = new this({
    label,
  });

  const validate = newCategory.validateSync();
  if (validate !== undefined) {
    throw new BadRequestError(`Validation error: ${validate.message}`);
  }

  const savedCategory = await newCategory.save();
  return savedCategory;
};

categorySchema.statics.saveChange = async function (
  id,
  data = {
    label: null,
  }
) {
  const { label } = data;
  const category = await this.findOne({
    _id: id,
  });
  if (!category) {
    throw new BadRequestError(`Category with id ${id} does not exists`);
  }
  if (!label) {
    throw new BadRequestError("Missing required parameters among: label");
  }
  Object.assign(category, {
    label,
  });

  const validate = category.validateSync();
  if (validate !== undefined) {
    throw new BadRequestError(`Validation error: ${validate.message}`);
  }

  const updatedCategory = await category.save();
  return updatedCategory;
};

categorySchema.statics.findAll = async function () {
  return await this.find({});
};

export default model("Category", categorySchema);
