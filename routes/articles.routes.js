import express from "express";
const { Router } = express;
import Category from "../models/category.model.js";
import Article from "../models/article.model.js";

const articlesRouter = Router();

articlesRouter.get( "/articles/new", async (req, res, next) => {
  try {
    const categories = await Category.findAll();
    res.render("articles/new", {
      categories,
    });
  } catch (error) {
    next(error);
  }
});

articlesRouter.get("/articles/:id/delete", async (req, res, next) => {
  try {
    const { id } = req.params;
    const article = await Article.findOne({
      _id: id
    });
    await article.deleteOne();
    req.session.flash = {
      message: 'Article deleted with success',
      type: 'success'
    };
    res.redirect("/");
  } catch (error) {
    next(error);
  }
});

articlesRouter.get("/articles/:id/edit", async (req, res, next) => {
  try {
    const {id} = req.params;
    const categories = await Category.findAll();
    const article = await Article.findOneWithQuizz(id)
    res.render("articles/edit", {
      article,
      categories,
      id
    });
  } catch (error) {
    next(error);
  }
});


articlesRouter.get("/articles/:id", async (req, res, next) => {
  try {
    const {id} = req.params
    const article = await Article.findOneWithUserResponse(id, req.session.currentUser);
    res.render("articles/show", {
      article,
    });
  } catch (error) {
    console.log(error)
    next(error);
  }
});

articlesRouter.post("/articles", async (req, res, next) => {
  try {
    const { content, title, category, preview, imgPreview } = req.body;
    const article = await Article.register({
      content,
      title,
      category,
      user: req.session.currentUser,
      preview,
      imgPreview
    });
    req.session.flash = {
      message: 'Article published with success',
      type: 'success'
    };
    res.redirect(`/articles/${article.id}`);
  } catch (error) {
    next(error);
  }
});

articlesRouter.post("/articles/:id", async (req, res, next) => {
  try {
    const {id} = req.params
    const { content, title, category, preview, imgPreview } = req.body;
    const article = await Article.saveChange(id,{
      content,
      title,
      category,
      user: req.session.currentUser,
      preview,
      imgPreview
    });
    req.session.flash = {
      message: 'Article updated with success',
      type: 'success'
    };
    res.redirect(`/articles/${article.id}`);
  } catch (error) {
    next(error);
  }
});



export default articlesRouter;
