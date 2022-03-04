import express from "express";
import User from "../models/user.model.js";
import filter from "content-filter";
import { filterOptions } from "../middlewares/index.js";
const { Router } = express;

const adminRouter = Router();

adminRouter.get(
  "/admin/dashboard",
  filter(filterOptions),
  async (req, res, next) => {
    try {
      const { users, quiz, articles, categories } = await User.getAdminData();
      res.render("admin/dashboard", {
        users,
        quiz,
        articles,
        categories,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default adminRouter;
