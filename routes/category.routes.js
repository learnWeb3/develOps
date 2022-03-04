import express from "express";
const { Router } = express;
import Category from "../models/category.model.js";
import filter from "content-filter";
import { filterOptions } from "../middlewares/index.js";

const categoryRouter = Router();

categoryRouter.get(
  "/categories/new",
  filter(filterOptions),
  async (req, res, next) => {
    try {
      res.render("categories/new", {});
    } catch (error) {
      next(error);
    }
  }
);

categoryRouter.post(
  "/categories",
  filter(filterOptions),
  async (req, res, next) => {
    try {
      const { label } = req.body;
      await Category.register({
        label,
      });
      req.session.flash = {
        message: "Category created with success",
        type: "success",
      };
      res.redirect("/categories/new");
    } catch (error) {
      next(error);
    }
  }
);

categoryRouter.post(
  "/categories/:id",
  filter(filterOptions),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { label } = req.body;
      const category = await Category.saveChange(id, {
        label,
      });
      req.session.flash = {
        message: "Category updated with success",
        type: "success",
      };
      res.redirect(`/categories/${category.id}/edit`);
    } catch (error) {
      next(error);
    }
  }
);

categoryRouter.get(
  "/categories/:id/edit",
  filter(filterOptions),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const category = await Category.findOne({
        _id: id,
      });
      res.render("categories/edit", {
        category,
        id,
      });
    } catch (error) {
      next(error);
    }
  }
);

categoryRouter.get(
  "/categories/:id/delete",
  filter(filterOptions),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const category = await Category.findOne({
        _id: id,
      });
      await category.deleteOne({
        _id: id,
      });
      req.session.flash = {
        message: "Category deleted with success",
        type: "success",
      };
      res.redirect("/categories/new");
    } catch (error) {
      next(error);
    }
  }
);

export default categoryRouter;
