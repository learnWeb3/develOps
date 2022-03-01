import express from "express";
const { Router } = express;

const quizRouter = Router();

quizRouter.get("/quiz/new", async (req, res) => {
  try {
    res.render("quiz/new", {});
  } catch (error) {
    next(error);
  }
});

quizRouter.get("/quiz/:id/edit", async (req, res) => {
  try {
    res.render("quiz/edit", {});
  } catch (error) {
    next(error);
  }
});

export default quizRouter;
