import express from "express";
import { NotFoundError } from "../base/errors/index.js";
const { Router } = express;
const staticRouter = Router();

staticRouter.get("/", (req, res, next) => {
  try {
    res.render("static/home");
  } catch (error) {
    next(error);
  }
});

export default staticRouter;
