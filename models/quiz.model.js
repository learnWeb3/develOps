import mongoose from "mongoose";
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

export default model("Quiz", quizSchema);
