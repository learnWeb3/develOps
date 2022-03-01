import express from "express";
const { Router } = express;

const adminRouter = Router();

adminRouter.get("/admin/dashboard", async (req, res) => {
    res.render("admin/dashboard", {});
});


export default adminRouter;