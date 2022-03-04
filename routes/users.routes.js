import express from "express";
import User from "../models/user.model.js";
import filter from "content-filter";
import { filterOptions } from "../middlewares/index.js";

const usersRouter = express.Router();

usersRouter.get("/login", filter(filterOptions), async (req, res, next) => {
  try {
    res.render("users/login", {});
  } catch (error) {
    next(error);
  }
});

usersRouter.post("/login", filter(filterOptions), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.login({
      email,
      password,
    });
    req.session.currentUser = user.id;
    req.session.role = user.role;
    req.session.flash = {
      message: "Logged in successfully",
      type: "success",
    };
    res.redirect("/");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

usersRouter.post(
  "/users/:id",
  filter(filterOptions),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const {
        email,
        password,
        username,
        password_confirmation,
        current_password,
        role,
      } = req.body;
      const user = await User.saveChange(id, {
        email,
        password,
        password_confirmation,
        username,
        current_password,
        current_user: req.session.currentUser,
        role,
      });
      req.session.flash = {
        message: "Account updated with success",
        type: "success",
      };
      res.redirect(`/users/${user._id}`);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

usersRouter.post("/register", filter(filterOptions), async (req, res, next) => {
  try {
    const { email, password, username, password_confirmation } = req.body;
    await User.register({
      email,
      password,
      password_confirmation,
      username,
    });
    req.session.flash = {
      message: "Account created with success",
      type: "success",
    };
    res.redirect("/login");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

usersRouter.get("/logout", filter(filterOptions), async (req, res, next) => {
  try {
    delete req.session.currentUser;
    delete req.session.role;
    req.session.flash = {
      message: "Logged out successfully",
      type: "success",
    };
    res.redirect("/");
  } catch (error) {
    next(error);
  }
});

usersRouter.get("/register", filter(filterOptions), async (req, res, next) => {
  try {
    req.session.flash = {
      message:
        "Hi there, welcome to develOps, please signup to have full access to the platform",
      type: "info",
    };
    res.render("users/register", {});
  } catch (error) {
    next(error);
  }
});

usersRouter.get("/users/:id", filter(filterOptions), async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({
      _id: id,
    });
    const roles = User.getExistingRoles();
    res.render("users/me", {
      user,
      roles,
    });
  } catch (error) {
    next(error);
  }
});

export default usersRouter;
