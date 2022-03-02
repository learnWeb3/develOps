import express from "express";
const { Router } = express;
import Article from "../models/article.model.js";
import Quiz from "../models/quiz.model.js";

const quizRouter = Router();

quizRouter.get("/quiz/new", async (req, res, next) => {
  try {
    const articles = await Article.find({})
    res.render("quiz/new", {
      articles
    });
  } catch (error) {
    next(error);
  }
});

quizRouter.get("/quiz/:id/edit", async (req, res, next) => {
  try {
    const {id} = req.params;
    const articles = await Article.find({})
    const quiz = await Quiz.findOne({
      _id: id
    })
    res.render("quiz/edit", {
      articles,
      quiz
    });
  } catch (error) {
    next(error);
  }
});

quizRouter.post("/quiz", async (req, res, next) => {
  try {
     const {
      title,
      questionContent,
      answer,
      isValid,
     } = req.body
     await Quiz.register({
      title,
      questionContent,
      answer,
      isValid,
     })
  } catch (error) {
    next(error);
  }
});

quizRouter.post("/quiz/:id", async (req, res, next) => {
  try {
     console.log(req.body)
  } catch (error) {
    next(error);
  }
});

export default quizRouter;
