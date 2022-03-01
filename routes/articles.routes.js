import express from "express";
const { Router } = express;
import Category from "../models/category.model.js";
import Article from "../models/article.model.js";

const articlesRouter = Router();

articlesRouter.get("/articles/new", async (req, res, next) => {
  try {
    const categories = await Category.findAll();
    res.render("articles/new", {
      categories,
    });
  } catch (error) {
    next(error);
  }
});

articlesRouter.get("/articles/:id/edit", async (req, res, next) => {
  try {
    const categories = await Category.findAll();
    res.render("articles/edit", {
      categories,
    });
  } catch (error) {
    next(error);
  }
});

articlesRouter.get("/articles/:id", async (req, res, next) => {
  try {
    res.render("articles/show", {});
  } catch (error) {
    next(error);
  }
});

articlesRouter.post("/articles", async (req, res, next) => {
  try {
    const { content, title, category } = req.body;
    const article = await Article.register({
      content,
      title,
      category,
      user: req.session.currentUser,
    });
    res.redirect("/");
  } catch (error) {
    next(error);
  }
});

articlesRouter.get("/articles/:id/delete", async (req, res, next) => {
  try {
    const { id } = req.params;
    await Article.deleteOne({
      _id: id,
    });
    res.redirect("/");
  } catch (error) {
    next(error);
  }
});

export default articlesRouter;
