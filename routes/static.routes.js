import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
const __dirname = dirname(fileURLToPath(import.meta.url));
const { Router } = express;
const staticRouter = Router();

staticRouter.get("/", (req, res, next) => {
  try {
    console.log(req.session.currentUser)
    res.render("static/home");
  } catch (error) {
    next(error);
  }
});

staticRouter.get("*", (req, res, next) => {
  try {
    res.sendFile(path.join(__dirname, "../public", "images/404.jpg"));
  } catch (error) {
    next(error);
  }
});

export default staticRouter;
