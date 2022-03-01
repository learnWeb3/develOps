import express from "express";
const { Router } = express;
import Category from "../models/category.model.js";

const categoryRouter = Router();

categoryRouter.get("/categories/new", async (req, res, next) => {
  try {
    res.render("categories/new", {});
  } catch (error) {
    next(error);
  }
});

categoryRouter.post("/categories", async (req, res, next) => {
  try {
      const {label} = req.body
      await Category.register({
        label
      });
      res.redirect('/categories/new')
  } catch (error) {
    next(error);
  }
});

categoryRouter.get("/categories/:id/edit", async (req, res, next) => {
  try {
    res.render("categories/edit", {});
  } catch (error) {
    next(error);
  }
});

categoryRouter.get("/categories/:id/delete", async (req, res, next) => {
  try {
    const {id} = req.params;
    await Category.deleteOne({
        _id: id
    })
    res.redirect("/categories/new");
  } catch (error) {
    next(error);
  }
});

export default categoryRouter;
