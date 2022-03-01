import express from "express";
const {Router} = express


const quizRouter = Router()

quizRouter.get('/quiz/new', async (req, res)=>{
    res.render("quiz/new", {});
});

quizRouter.get('/quiz/:id/edit', async (req, res)=>{
    res.render("quiz/edit", {});
});


export default quizRouter;
