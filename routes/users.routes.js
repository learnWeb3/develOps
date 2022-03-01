import express from "express";

const usersRouter = express.Router();

usersRouter.get("/login", async (req, res) => {
  res.render("users/login", {});
});

usersRouter.get("/register", async (req, res) => {
  res.render("users/register", {});
});

usersRouter.get("/me", async (req, res) => {
  res.render("users/me", {});
});

export default usersRouter;
