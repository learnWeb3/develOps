import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
const __dirname = dirname(fileURLToPath(import.meta.url));
const {Router} = express
const staticRouter = Router();

staticRouter.get("/", (req, res) => {
    res.render("static/home");
});

staticRouter.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../public", "images/404.jpg"));
});

export default staticRouter;