import express from "express";
const { Router } = express;

const adminRouter = Router();

adminRouter.get("/admin/dashboard", async (req, res, next) => {
  try {
    res.render("admin/dashboard", {});
  } catch (error) {
    next(error);
  }
});

export default adminRouter;
