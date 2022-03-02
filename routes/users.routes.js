import express from "express";
import User from "../models/user.model.js";

const usersRouter = express.Router();

usersRouter.get("/login", async (req, res, next) => {
  res.render("users/login", {});
});

usersRouter.post("/login", async(req, res, next)=>{
  try { 
    const {email, password} = req.body
    const user = await User.login({
      email, 
      password
    });
    console.log(user)
    req.session.currentUser = user.id;
    res.redirect('/')
  } catch (error) {
    console.error(error)
    next(error)
  }
})

usersRouter.post("/register", async (req, res, next)=>{
  try { 
    const {email, password, username, password_confirmation} = req.body
    await User.register({
      email, 
      password,
      password_confirmation,
      username
    });
    res.redirect('/login')
  } catch (error) {
    console.error(error)
    next(error)
  }
})

usersRouter.get("/logout", async (req, res, next) => {
  delete req.session.currentUser;
  res.redirect('/')
});


usersRouter.get("/register", async (req, res, next) => {
  res.render("users/register", {});
});

usersRouter.get("/me", async (req, res, next) => {
  res.render("users/me", {});
});

export default usersRouter;
