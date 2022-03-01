import mongoose from "mongoose";
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

export default model("Question", questionSchema);
