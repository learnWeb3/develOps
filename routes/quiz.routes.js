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

quizRouter.post('/quiz/:id/validate', async (req, res, next)=>{
  try {
    const {id} = req.params;
    const {question} = req.body;
    const current_user = req.session.currentUser
    const data = await Quiz.registerAnswer(id, {
      question,
      current_user
    })
    req.session.flash = {
      message: 'Answer registered with success',
      type: 'success'
    };
    res.redirect('/')
  } catch (error) {
    next(error)
  }
})

quizRouter.post("/quiz", async (req, res, next) => {
  try {
     const {
      title,
      questionContent,
      answer,
      isValid,
      article
     } = req.body;
     await Quiz.register({
      title,
      questionContent,
      answer,
      isValid,
      article
     })
     req.session.flash = {
      message: 'Quiz added with success',
      type: 'success'
    };
     res.redirect(`/articles/${article}`)
  } catch (error) {
    next(error);
  }
});

quizRouter.post("/quiz/:id", async (req, res, next) => {
  try {
     const {id} = req.params;
     req.session.flash = {
      message: 'Quiz updated with success',
      type: 'success'
    };
     res.redirect(`/articles/${id}`)
  } catch (error) {
    next(error);
  }
});

export default quizRouter;
