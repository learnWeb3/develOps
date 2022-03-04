import express from "express";
const { Router } = express;
const staticRouter = Router();
import Article from "../models/article.model.js";
import Category from "../models/category.model.js";
import filter from "content-filter";
import { filterOptions } from "../middlewares/index.js";

staticRouter.get("/", filter(filterOptions), async (req, res, next) => {
  try {
    const articles = await Article.findLast(4);
    const categories = await Category.find({});
    res.render("static/home", {
      articles,
      categories,
    });
  } catch (error) {
    next(error);
  }
});

export default staticRouter;
