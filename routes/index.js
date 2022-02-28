import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
const __dirname = dirname(fileURLToPath(import.meta.url));
const router = express.Router();


router.get("/", (req, res) => {
    res.render("home", { template: "home" });
});

router.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../public", "images/404.jpg"));
});

export default router;