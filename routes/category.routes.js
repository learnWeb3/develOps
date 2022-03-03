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
      req.session.flash = {
        message: 'Category created with success',
        type: 'success'
      }
      res.redirect('/categories/new')
  } catch (error) {
    next(error);
  }
});

categoryRouter.post("/categories/:id", async (req, res, next) => {
  try {
      const {id} = req.params
      const {label} = req.body
      const category = await Category.saveChange(id, {
        label
      });
      req.session.flash = {
        message: 'Category updated with success',
        type: 'success'
      }
      res.redirect(`/categories/${category.id}/edit`)
  } catch (error) {
    next(error);
  }
});

categoryRouter.get("/categories/:id/edit", async (req, res, next) => {
  try {
    const {id} = req.params;
    const category = await Category.findOne({
      _id: id
    });
    res.render("categories/edit", {
      category,
      id
    });
  } catch (error) {
    next(error);
  }
});

categoryRouter.get("/categories/:id/delete", async (req, res, next) => {
  try {
    const {id} = req.params;
    const category = await Category.findOne({
      _id: id
    })
    await category.deleteOne({
        _id: id
    });
    req.session.flash = {
      message: 'Category deleted with success',
      type: 'success'
    };
    res.redirect("/categories/new");
  } catch (error) {
    next(error);
  }
});

export default categoryRouter;
