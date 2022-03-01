import express from "express";
const {Router} = express

const articlesRouter = Router()

articlesRouter.get('/articles/new',async (req, res)=>{
    res.render("articles/new", {});
});

articlesRouter.get('/articles/:id/edit', async (req, res)=>{
    res.render("articles/edit", {});
});

articlesRouter.get('/articles/:id', async (req, res)=>{
    res.render("articles/show", {});
});


export default articlesRouter;