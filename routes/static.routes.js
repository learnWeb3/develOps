import express from "express";
import { NotFoundError } from "../base/errors/index.js";
const { Router } = express;
const staticRouter = Router();
import Article from '../models/article.model.js'

staticRouter.get("/", async (req, res, next) => {
  try {
    const articles = await Article.findLast(4)
    res.render("static/home", {
      articles
    });
    
  } catch (error) {
    next(error);
  }
});

export default staticRouter;
