import express from "express";
import User from '../models/user.model.js'
const { Router } = express;

const adminRouter = Router();

adminRouter.get("/admin/dashboard", async (req, res, next) => {
  try {
    const {users, quiz, articles, categories} = await User.getAdminData();
    res.render("admin/dashboard", {
      users,
      quiz,
      articles,
      categories
    });
  } catch (error) {
    next(error);
  }
});

export default adminRouter;
